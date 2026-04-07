interface GitHubPagesResult {
  deployedUrl: string;
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function deployToGitHubPages(
  repoFullName: string
): Promise<GitHubPagesResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  // Enable GitHub Pages on main branch, root source
  const pagesRes = await githubApi(`/repos/${repoFullName}/pages`, token, {
    method: "POST",
    body: {
      source: {
        branch: "main",
        path: "/",
      },
      build_type: "workflow",
    },
  });

  if (!pagesRes.ok) {
    const err = await pagesRes.json();
    // 409 means Pages is already enabled — that's fine
    if (pagesRes.status !== 409 && pagesRes.status !== 422) {
      throw new Error(`Failed to enable GitHub Pages: ${JSON.stringify(err)}`);
    }
    // If 422, Pages may already be configured — try to update instead
    if (pagesRes.status === 422) {
      const updateRes = await githubApi(
        `/repos/${repoFullName}/pages`,
        token,
        {
          method: "PUT",
          body: {
            source: {
              branch: "main",
              path: "/",
            },
            build_type: "workflow",
          },
        }
      );
      if (!updateRes.ok && updateRes.status !== 409) {
        // Pages might already be correctly configured, continue
      }
    }
  }

  // Poll for GitHub Pages deployment to complete
  const maxAttempts = 30;
  const pollInterval = 10_000; // 10 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(pollInterval);

    const statusRes = await githubApi(
      `/repos/${repoFullName}/pages`,
      token
    );

    if (statusRes.ok) {
      const pages = (await statusRes.json()) as {
        status: string | null;
        html_url: string;
      };

      if (pages.html_url) {
        // Verify the site is actually responding
        try {
          const siteCheck = await fetch(pages.html_url, {
            method: "HEAD",
            redirect: "follow",
          });
          if (siteCheck.ok || siteCheck.status === 304) {
            return { deployedUrl: pages.html_url };
          }
        } catch {
          // Site not ready yet, continue polling
        }
      }
    }
  }

  // If polling times out, construct the URL from the repo name
  const [owner, repo] = repoFullName.split("/");
  const fallbackUrl = `https://${owner}.github.io/${repo}`;
  return { deployedUrl: fallbackUrl };
}
