export function Ornament({ children = '❧ ❀ ❧' }) {
  return <div className="ornament" aria-hidden="true">{children}</div>;
}
