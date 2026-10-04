import type { LegalPage } from "@/content/types";
import styles from "./LegalContent.module.css";

export function LegalContent({ page }: { page: LegalPage }) {
  return (
    <article className={`container ${styles.article}`}>
      <h1>{page.title}</h1>
      {page.sections.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
