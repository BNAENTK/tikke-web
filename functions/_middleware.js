// 홈 <head> 메타태그를 KV 콘텐츠로 서버 주입하는 Pages Function 미들웨어.
// 공유 미리보기 크롤러(카톡·페북·트위터)는 JS를 안 돌리므로 정적 HTML에 서버단 주입 필요.
// 어드민이 KV(site:content.meta)에 저장 → 여기서 HTMLRewriter로 덮어씀. 정적 index.html 메타는 폴백.
// fail-open: 어떤 실패든(요청 실패·JSON 깨짐·빈 메타) 원본 그대로 통과 — 미들웨어가 사이트를 죽이지 않음.

const CONTENT_URL = "https://api.tikke.kr/content";

class AttrSetter {
  constructor(value) { this.value = value; }
  element(el) { el.setAttribute("content", this.value); }
}
class TitleSetter {
  constructor(text) { this.text = text; }
  element(el) { el.setInnerContent(this.text); }
}

export async function onRequest(context) {
  const res = await context.next();
  try {
    // 홈에만 적용 (다른 페이지는 자기 메타 보유)
    const path = new URL(context.request.url).pathname;
    if (path !== "/" && path !== "/index.html") return res;

    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html")) return res;

    const r = await fetch(CONTENT_URL, { cf: { cacheTtl: 30, cacheEverything: true } });
    if (!r.ok) return res;
    const data = await r.json();
    const meta = data && data.meta;
    if (!meta || typeof meta !== "object") return res;

    const title = meta.title && String(meta.title).trim();
    const desc = meta.description && String(meta.description).trim();
    const ogImage = meta.og_image && String(meta.og_image).trim();
    if (!title && !desc && !ogImage) return res;

    let rw = new HTMLRewriter();
    if (title) {
      rw = rw
        .on("title", new TitleSetter(title))
        .on('meta[property="og:title"]', new AttrSetter(title))
        .on('meta[name="twitter:title"]', new AttrSetter(title));
    }
    if (desc) {
      rw = rw
        .on('meta[name="description"]', new AttrSetter(desc))
        .on('meta[property="og:description"]', new AttrSetter(desc))
        .on('meta[name="twitter:description"]', new AttrSetter(desc));
    }
    if (ogImage) {
      rw = rw
        .on('meta[property="og:image"]', new AttrSetter(ogImage))
        .on('meta[name="twitter:image"]', new AttrSetter(ogImage));
    }
    return rw.transform(res);
  } catch (e) {
    return res; // fail-open
  }
}
