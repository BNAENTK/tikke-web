// Icon set - simple stroke style
const Icon = ({ name, size = 18, color = "currentColor", stroke = 1.6 }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "play":
      return <svg {...p}><polygon points="6 4 20 12 6 20 6 4" fill={color} stroke="none"/></svg>;
    case "download":
      return <svg {...p}><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg>;
    case "arrow":
      return <svg {...p}><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>;
    case "spark":
      return <svg {...p}><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m5.6 5.6 2.8 2.8"/><path d="m15.6 15.6 2.8 2.8"/><path d="m5.6 18.4 2.8-2.8"/><path d="m15.6 8.4 2.8-2.8"/></svg>;
    case "link":
      return <svg {...p}><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>;
    case "chat":
      return <svg {...p}><path d="M3 12a8 8 0 1 1 3.5 6.6L3 20l1.4-3.5A8 8 0 0 1 3 12Z"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>;
    case "kakao":
      return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M12 3.5C6.8 3.5 2.5 6.9 2.5 11.1c0 2.7 1.8 5.1 4.5 6.4l-.9 3.3c-.1.3.2.6.5.4l3.9-2.6c.5.1 1 .1 1.5.1 5.2 0 9.5-3.4 9.5-7.6 0-4.2-4.3-7.6-9.5-7.6Z"/></svg>;
    case "gift":
      return <svg {...p}><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v9H5v-9"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9 3 10.5 4.5 12 8c1.5-3.5 3-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>;
    case "heart":
      return <svg {...p}><path d="M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 17.5 4 5 5 0 0 0 12 7a5 5 0 0 0-5.5-3A4.5 4.5 0 0 0 2 8.5C2 13 7 17 12 21c2-1.6 4-3.2 5.5-4.6"/></svg>;
    case "translate":
      return <svg {...p}><path d="M3 5h12"/><path d="M9 3v2"/><path d="M11 5c0 5-5 8-8 8"/><path d="M5 9c0 2 3 5 7 5"/><path d="m13 21 5-12 5 12"/><path d="M15.5 17h5"/></svg>;
    case "users":
      return <svg {...p}><circle cx="9" cy="8" r="4"/><path d="M2 21v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="8" r="3" opacity="0.6"/><path d="M22 21v-1a5 5 0 0 0-6-4.9" opacity="0.6"/></svg>;
    case "layout":
      return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>;
    case "broadcast":
      return <svg {...p}><circle cx="12" cy="12" r="2"/><path d="M16.5 7.5a6 6 0 0 1 0 9"/><path d="M7.5 7.5a6 6 0 0 0 0 9"/><path d="M19.5 4.5a10 10 0 0 1 0 15"/><path d="M4.5 4.5a10 10 0 0 0 0 15"/></svg>;
    case "shield":
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>;
    case "settings":
      return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>;
    case "music":
      return <svg {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case "github":
      return <svg {...p}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5A4 4 0 0 0 19 5.5a4 4 0 0 0-.1-3s-1.2-.4-3.9 1.5a13 13 0 0 0-7 0C5.3 2.1 4.1 2.5 4.1 2.5A4 4 0 0 0 4 5.5 4 4 0 0 0 3 9c0 3.5 3 5.5 6 5.5-.4.4-.7.9-.8 1.5-.2.6-.2 1.3-.2 2v4"/><path d="M9 18c-4 1.5-5-1-7-1"/></svg>;
    case "mic":
      return <svg {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>;
    case "command":
      return <svg {...p}><path d="M6 9V6a3 3 0 0 1 6 0v12a3 3 0 0 0 6 0v-3"/><path d="M6 15v3a3 3 0 0 0 6 0V6a3 3 0 0 1 6 0v3"/></svg>;
    case "timer":
      return <svg {...p}><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/><path d="M12 2v2"/></svg>;
    case "discord":
      return <svg {...p}><path d="M19 6.5A12 12 0 0 0 15.5 5l-.4.8a10 10 0 0 0-6.2 0L8.5 5A12 12 0 0 0 5 6.5a16 16 0 0 0-2 12 12 12 0 0 0 4 2l.8-1.2a8 8 0 0 1-1.5-.7l.4-.3a9 9 0 0 0 7.6 0l.4.3-1.5.7L14 20.5a12 12 0 0 0 4-2 16 16 0 0 0-2-12Z"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/></svg>;
    case "x":
      return <svg {...p}><path d="m4 4 16 16"/><path d="M20 4 4 20"/></svg>;
    case "apple":
      return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M16.5 12.5c0-3 2.5-4.5 2.6-4.6-1.4-2.1-3.6-2.4-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1-1 0-2.4-1.1-4-1.1-2 0-3.9 1.2-5 3-2.1 3.7-.5 9.2 1.6 12.2 1 1.5 2.2 3.1 3.8 3.1 1.5 0 2.1-1 4-1s2.3 1 3.9 1c1.6 0 2.6-1.5 3.6-3 1.1-1.7 1.6-3.4 1.6-3.5 0-.1-3.1-1.2-3.1-4.8ZM13.6 3.4c.9-1 1.4-2.5 1.3-3.9-1.2.1-2.7.8-3.6 1.8-.8.9-1.5 2.3-1.3 3.7 1.3.1 2.7-.6 3.6-1.6Z"/></svg>;
    case "windows":
      return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M3 5.5 11 4v8H3V5.5zM12 4l9-1.5V12h-9V4zM3 13h8v7.5L3 19v-6zm9 0h9v9.5L12 21v-8z"/></svg>;
    case "android":
      return <svg viewBox="0 0 24 24" width={size} height={size} fill={color}><path d="M17.5 11.5h-11v6a1.5 1.5 0 0 0 1.5 1.5h1v2a1.5 1.5 0 0 0 3 0v-2h2v2a1.5 1.5 0 0 0 3 0v-2h.5a1.5 1.5 0 0 0 1.5-1.5v-6h-1.5Zm-12.5-1A1.5 1.5 0 0 0 3.5 12v4a1.5 1.5 0 0 0 3 0v-4A1.5 1.5 0 0 0 5 10.5Zm14 0a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 3 0v-4A1.5 1.5 0 0 0 19 10.5Zm-2.6-7-1.1 1.9a6.6 6.6 0 0 0-6.6 0L7.6 3.5a.4.4 0 0 0-.7.4l1 1.7A5.6 5.6 0 0 0 6 10h12a5.6 5.6 0 0 0-1.9-4.4l1-1.7a.4.4 0 0 0-.7-.4ZM9 8.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm6 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Z"/></svg>;
    case "plus":
      return <svg {...p}><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
    case "check":
      return <svg {...p}><path d="m5 12 5 5L20 7"/></svg>;
    case "dollar":
      return <svg {...p}><path d="M12 2v20"/><path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    case "bell":
      return <svg {...p}><path d="M18 16a4 4 0 0 1-1-3v-3a5 5 0 0 0-10 0v3a4 4 0 0 1-1 3Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case "trophy":
      return <svg {...p}><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M6 5h12v6a6 6 0 0 1-12 0V5z"/><path d="M9 21h6"/><path d="M12 15v6"/></svg>;
    case "crown":
      return <svg {...p}><path d="M2 8l4 8h12l4-8-5 3-5-7-5 7-5-3z"/><path d="M5 20h14"/></svg>;
    case "gauge":
      return <svg {...p}><path d="M12 14a2 2 0 1 0 2-2"/><path d="M12 14l-4-4"/><path d="M3.5 17a10 10 0 1 1 17 0"/><path d="M3 21h18"/></svg>;
    case "chart":
      return <svg {...p}><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/><circle cx="7" cy="14" r="1.5" fill={color}/><circle cx="11" cy="10" r="1.5" fill={color}/><circle cx="15" cy="14" r="1.5" fill={color}/></svg>;
    case "plug":
      return <svg {...p}><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M6 13V8h12v5a5 5 0 0 1-10 0 5 5 0 0 1-2 0"/></svg>;
    case "search":
      return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>;
    default: return null;
  }
};

window.Icon = Icon;
