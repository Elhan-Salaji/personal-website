import { projects } from "@/content/projects";
import { Section } from "./Section";
import { sections } from "./sections";
import styles from "./Projects.module.css";

export function Projects() {
  return (
    <Section id={sections.projects.id} title={sections.projects.label}>
      <ul className={styles.list}>
        {projects.map((project) => (
          <li key={project.title} className={styles.item}>
            <article>
              <h3 className={styles.title}>{project.title}</h3>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.meta}>
                <p className={styles.technologies}>
                  <span className="visually-hidden">Technologien: </span>
                  {project.technologies.join(", ")}
                </p>
                <a href={project.githubUrl} rel="noopener noreferrer">
                  Code auf GitHub<span className="visually-hidden">: {project.title}</span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
