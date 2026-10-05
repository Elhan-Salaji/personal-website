import Link from "next/link";
import { profile, workInProgress } from "@/content/profile";
import { navigationOrder } from "./sections";
import styles from "./SiteHeader.module.css";

/**
 * Kopfzeile mit Ankernavigation. Die Links zeigen auf "/#anker",
 * damit sie auch von Impressum und Datenschutz aus funktionieren.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandRow}>
          <Link href="/" className={styles.brand}>
            {profile.name}
          </Link>
          {workInProgress && (
            <span className={styles.wip} title="Work in Progress: Die Seite ist noch in Arbeit">
              <span aria-hidden="true">WIP</span>
              <span className="visually-hidden">Die Seite ist noch in Arbeit</span>
            </span>
          )}
        </div>
        <nav aria-label="Hauptnavigation">
          <ul className={styles.navList}>
            {navigationOrder.map((section) => (
              <li key={section.id}>
                <Link href={`/#${section.id}`} className={styles.navLink}>
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
