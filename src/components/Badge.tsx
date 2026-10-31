export function PlaceholderBadge({ children = "Placeholder" }: { children?: string }) {
  return <span className="badge">{children}</span>;
}

export function Tbc({ label = "To be confirmed" }: { label?: string }) {
  return <span className="tbc">{label}</span>;
}
