/** The designer's credit: a quote and one line of contact details, English only. */
export function Footer() {
  return (
    <footer className="footer">
      <p className="footer-quote">“Every beautiful beginning deserves an invitation as special as the moment.”</p>
      <span className="footer-rule" aria-hidden="true"><span />✧<span /></span>
      <p className="footer-credit">Designed by <b>Manoj Kumar N</b></p>
      <p className="footer-contact">
        <a href="tel:8095828114">8095828114</a>
        <span aria-hidden="true">·</span>
        <a href="mailto:manojkumarn858@gmail.com">manojkumarn858@gmail.com</a>
      </p>
    </footer>
  );
}
