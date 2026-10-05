import { cvCategoryOrder, cvEntries, cvPdfPath } from "@/content/cv";
import { Section } from "./Section";
import { sections } from "./sections";
import styles from "./Resume.module.css";

export function Resume() {
  const groups = cvCategoryOrder
    .map((category) => ({
      category,
      entries: cvEntries.filter((entry) => entry.category === category),
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <Section id={sections.cv.id} title={sections.cv.label}>
      <div className={styles.groups}>
        {groups.map(({ category, entries }) => (
          <div key={category}>
            <h3>{category}</h3>
            <ol className={styles.timeline}>
              {entries.map((entry) => (
                <li key={`${entry.period}-${entry.title}`} className={styles.entry}>
                  <p className={styles.period}>{entry.period}</p>
                  <p className={styles.title}>{entry.title}</p>
                  <p className={styles.organization}>{entry.organization}</p>
                  {entry.description && <p className={styles.description}>{entry.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      {cvPdfPath && (
        <a href={cvPdfPath} className="button" download>
          Lebenslauf als PDF herunterladen
        </a>
      )}
    </Section>
  );
}
