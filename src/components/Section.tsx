import type { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/**
 * Abschnitt des One-Pagers mit Überschrift, die zugleich als Anker dient.
 * Ab Desktop steht die Überschrift in der linken Spalte, der Inhalt rechts.
 */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-titel`;
  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
