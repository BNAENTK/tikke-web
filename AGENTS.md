# tikke-web — Codex 지침

tikke 웹(`tikke/apps/web`)의 **별도 사본 저장소**다. Cloudflare Pages 프로젝트 이름도 `tikke-web`이지만, 배포 원본은 `../tikke/apps/web`이다. 여기서 직접 기능을 만들거나 Wrangler로 배포하지 않는다.

배포: **wrangler 직접 배포 금지.** `tikke/apps/web` raw 파일을 이 폴더로 미러링(node_modules/dist/.wrangler/src/package.json/tsconfig/vite.config/.env 제외) → commit → `git push origin main` → CF 자동배포. **"Pages 배포해" 라고 명시할 때만.** 전역 규칙은 `~/.codex/AGENTS.md`.

2026-09-12에 이 저장소의 문서 push가 Cloudflare Git 자동 배포를 일으켜 옛 index가 올라간 사고가 있었다. 2026-09-13 재발 방지 작업에서 Cloudflare의 production 자동 배포를 끄고 preview를 `none`으로 변경했다. Git 연결 자체는 남아 있으므로 **push 전 실제 자동 배포 설정을 확인하며, 다시 켜지 않는다.**

- 문서 변경을 위해 원본을 이 폴더에 미러링하거나, 사이트 복구를 위해 이 저장소를 push하지 않는다.
- GitHub Actions가 수동 전용이어도 Cloudflare 자체 자동 배포가 꺼졌다는 뜻은 아니다. 두 경로를 각각 확인한다.
- 배포가 필요하면 사용자의 명시 요청을 확인하고 `../tikke/apps/web`에서 진행한다. 원본·라이브 확인 및 배포 절차는 `../tikke/docs/CLOUDFLARE.md`를 따른다.
