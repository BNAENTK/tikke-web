// admin/github.js — GitHub Contents API helper for committing content.json.

window.tikkeGitHub = (function () {
  function b64encodeUtf8(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function b64decodeUtf8(b64) {
    try {
      return decodeURIComponent(escape(atob(b64.replace(/\s/g, ""))));
    } catch (e) {
      return atob(b64.replace(/\s/g, ""));
    }
  }

  function headers(token) {
    return {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  async function getFile(cfg) {
    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path)}?ref=${encodeURIComponent(cfg.branch)}`;
    const r = await fetch(url, { headers: headers(cfg.token) });
    if (r.status === 404) return { exists: false, sha: null, content: null };
    if (!r.ok) {
      const msg = await r.text().catch(() => "");
      throw new Error("GitHub get failed (" + r.status + "): " + msg.slice(0, 200));
    }
    const data = await r.json();
    return {
      exists: true,
      sha: data.sha,
      content: b64decodeUtf8(data.content || "")
    };
  }

  async function putFile(cfg, contentText, message, sha) {
    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path)}`;
    const body = {
      message: message || "Update content via admin",
      content: b64encodeUtf8(contentText),
      branch: cfg.branch
    };
    if (sha) body.sha = sha;
    const r = await fetch(url, {
      method: "PUT",
      headers: { ...headers(cfg.token), "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      const msg = await r.text().catch(() => "");
      throw new Error("GitHub commit failed (" + r.status + "): " + msg.slice(0, 300));
    }
    const data = await r.json();
    return { sha: data.content && data.content.sha, commitSha: data.commit && data.commit.sha };
  }

  async function verifyToken(cfg) {
    const r = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}`, {
      headers: headers(cfg.token)
    });
    if (!r.ok) {
      const msg = await r.text().catch(() => "");
      throw new Error("토큰/저장소 확인 실패 (" + r.status + "): " + msg.slice(0, 200));
    }
    const data = await r.json();
    return { name: data.full_name, defaultBranch: data.default_branch, private: data.private };
  }

  return { getFile, putFile, verifyToken };
})();
