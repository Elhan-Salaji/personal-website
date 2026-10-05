import type { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/** Abschnitt des One-Pagers mit Überschrift, die zugleich als Anker dient. */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-titel`;
  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <div className="container">
        <h2 id={headingId}>{title}</h2>
        {children}
      </div>
    </section>
  );
}
