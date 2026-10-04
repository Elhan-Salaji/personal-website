import { skillGroups } from "@/content/skills";
import { Section } from "./Section";
import { sections } from "./sections";
import styles from "./Skills.module.css";

export function Skills() {
  return (
    <Section id={sections.skills.id} title={sections.skills.label}>
      <div className={styles.grid}>
        {skillGroups.map((group) => (
          <div key={group.area} className={styles.group}>
            <h3>{group.area}</h3>
            <ul className="tag-list">
              {group.skills.map((skill) => (
                <li key={skill} className="tag">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
