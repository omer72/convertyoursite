import type { GeneratedCode } from "./store";

interface GitHubRepoResult {
  repoUrl: string;
  repoFullName: string;
}

async function githubApi(
  path: string,
  token: string,
  options: { method?: string; body?: unknown } = {}
): Promise<Response> {
  const res = await fetch(`https://api.github.com${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  return res;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export async function pushToGitHub(
  clientName: string,
  generatedCode: GeneratedCode
): Promise<GitHubRepoResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  const repoName = `${slugify(clientName)}-site`;

  // Get authenticated user
  const userRes = await githubApi("/user", token);
  if (!userRes.ok) {
    throw new Error(`GitHub auth failed: ${userRes.status}`);
  }
  const user = (await userRes.json()) as { login: string };

  // Create repository
  const createRes = await githubApi("/user/repos", token, {
    method: "POST",
    body: {
      name: repoName,
      description: `Generated website for ${clientName}`,
      private: false,
      auto_init: true,
    },
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    // If repo already exists, that's ok — we'll push to it
    if (createRes.status !== 422) {
      throw new Error(`Failed to create repo: ${JSON.stringify(err)}`);
    }
  }

  const repoFullName = `${user.login}/${repoName}`;

  // Ensure repo is initialized (has at least one commit).
  // The Git database API returns 409 on empty repos.
  const mainRef = await githubApi(`/repos/${repoFullName}/git/ref/heads/main`, token);
  if (!mainRef.ok) {
    // No main branch — repo is empty. Seed it via the Contents API.
    const initRes = await githubApi(`/repos/${repoFullName}/contents/README.md`, token, {
      method: "PUT",
      body: {
        message: "Initial commit",
        content: Buffer.from(`# ${clientName} site\n`).toString("base64"),
      },
    });
    if (!initRes.ok && initRes.status !== 422) {
      throw new Error(`Failed to initialize empty repo: ${initRes.status}`);
    }
  }

  // Create all files via the Git Trees API for a single atomic commit
  // Step 1: Create blobs for all files
  const blobShas: { path: string; sha: string }[] = [];
  for (const file of generatedCode.files) {
    const blobRes = await githubApi(`/repos/${repoFullName}/git/blobs`, token, {
      method: "POST",
      body: {
        content: Buffer.from(file.content).toString("base64"),
        encoding: "base64",
      },
    });
    if (!blobRes.ok) {
      throw new Error(`Failed to create blob for ${file.path}: ${blobRes.status}`);
    }
    const blob = (await blobRes.json()) as { sha: string };
    blobShas.push({ path: file.path, sha: blob.sha });
  }

  // Step 2: Create tree
  const treeRes = await githubApi(`/repos/${repoFullName}/git/trees`, token, {
    method: "POST",
    body: {
      tree: blobShas.map((b) => ({
        path: b.path,
        mode: "100644",
        type: "blob",
        sha: b.sha,
      })),
    },
  });
  if (!treeRes.ok) {
    throw new Error(`Failed to create tree: ${treeRes.status}`);
  }
  const tree = (await treeRes.json()) as { sha: string };

  // Step 3: Create commit
  const commitRes = await githubApi(`/repos/${repoFullName}/git/commits`, token, {
    method: "POST",
    body: {
      message: `Initial generated site for ${clientName}`,
      tree: tree.sha,
    },
  });
  if (!commitRes.ok) {
    throw new Error(`Failed to create commit: ${commitRes.status}`);
  }
  const commit = (await commitRes.json()) as { sha: string };

  // Step 4: Create/update main branch reference
  const refRes = await githubApi(`/repos/${repoFullName}/git/refs`, token, {
    method: "POST",
    body: {
      ref: "refs/heads/main",
      sha: commit.sha,
    },
  });

  if (!refRes.ok) {
    // If ref already exists, update it
    if (refRes.status === 422) {
      const updateRefRes = await githubApi(
        `/repos/${repoFullName}/git/refs/heads/main`,
        token,
        {
          method: "PATCH",
          body: { sha: commit.sha, force: true },
        }
      );
      if (!updateRefRes.ok) {
        throw new Error(`Failed to update ref: ${updateRefRes.status}`);
      }
    } else {
      throw new Error(`Failed to create ref: ${refRes.status}`);
    }
  }

  return {
    repoUrl: `https://github.com/${repoFullName}`,
    repoFullName,
  };
}
