export function SectionDivider({ tone = 'gold' }) {
  return (
    <div className={`section-divider section-divider--${tone}`} aria-hidden="true">
      <span />
      <svg viewBox="0 0 36 28" focusable="false">
        <path d="M18 2c-3 5-8 8-13 8 4 4 8 5 13 3 5 2 9 1 13-3-5 0-10-3-13-8Zm0 11v12m-7-6c3 0 5 2 7 6 2-4 4-6 7-6" />
      </svg>
      <span />
    </div>
  );
}
