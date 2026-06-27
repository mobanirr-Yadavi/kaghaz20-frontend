export function PageIcon({ name }: { name: string }) {
  const icons: Record<string, string> = { shield: "♢", leaf: "♧", idea: "✧", people: "♙", globe: "◎", factory: "▥", award: "♕", clock: "◷", phone: "☎", mail: "✉", pin: "⌖" };
  return <span className="page-icon" aria-hidden="true">{icons[name] || "✦"}</span>;
}
