# tikke-web — Codex 지침

tikke 웹(`tikke/apps/web`)의 **배포용 저장소**(Cloudflare Pages 프로젝트 `tikke-web`). 소스의 원본은 `../tikke/apps/web` 이다 — 여기서 직접 기능을 만들지 말 것.

배포: `tikke/apps/web` 폴더에서 `wrangler pages deploy . --project-name=tikke-web --branch=main` (raw 파일, dist 금지). **"Pages 배포해" 라고 명시할 때만.** 전역 규칙은 `~/.codex/AGENTS.md`.

⚠️ **이 repo는 Cloudflare Pages git 연결 상태 — main에 push하면 그 내용이 즉시 tikke.kr에 배포된다.** 문서만 고쳐도 마찬가지. 따라서 push 전에 반드시 `../tikke/apps/web` 을 이 폴더로 미러링(node_modules/dist/src/package.json/tsconfig/vite.config/.env 제외)해 drift를 없애야 한다. 2026-09-12 AGENTS.md만 push했다가 옛 index가 배포돼 YUKKE 링크가 사라진 사고 있음.
