import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: "4rem" }}>
      <h1>Seite nicht gefunden</h1>
      <p>Diese Adresse gibt es auf der Website nicht.</p>
      <Link href="/">Zur Startseite</Link>
    </div>
  );
}
