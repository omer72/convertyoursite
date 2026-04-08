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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for the repo to be accessible and have at least one commit.
 * GitHub can take a few seconds after creation (especially with auto_init).
 */
async function waitForRepoReady(
  repoFullName: string,
  token: string,
  maxAttempts = 10
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await githubApi(`/repos/${repoFullName}/git/ref/heads/main`, token);
    if (res.ok) return;
    // Also check for 'master' branch (some GitHub configs default to master)
    const masterRes = await githubApi(`/repos/${repoFullName}/git/ref/heads/master`, token);
    if (masterRes.ok) return;
    await sleep(2000);
  }
  throw new Error(
    `Repo ${repoFullName} is not ready after ${maxAttempts} attempts. ` +
    `This usually means the GitHub token does not have Contents read/write permission on this repo, ` +
    `or the repo was not created with an initial commit. ` +
    `Try using a classic Personal Access Token with 'repo' scope instead of a fine-grained token.`
  );
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

  const repoFullName = `${user.login}/${repoName}`;

  // Check if repo already exists
  const existingRepo = await githubApi(`/repos/${repoFullName}`, token);

  if (!existingRepo.ok) {
    // Repo doesn't exist — create it with auto_init so it has an initial commit
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
      throw new Error(`Failed to create repo: ${JSON.stringify(err)}`);
    }
  }

  // Wait for repo to be accessible and initialized
  await waitForRepoReady(repoFullName, token);

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
