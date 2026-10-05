import Link from "next/link";
import { profile } from "@/content/profile";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav aria-label="Rechtliches">
          <ul className={styles.links}>
            <li>
              <Link href="/impressum">Impressum</Link>
            </li>
            <li>
              <Link href="/datenschutz">Datenschutz</Link>
            </li>
            <li>
              <Link href="/kalender" className={styles.subtle} prefetch={false}>
                Kalender
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
