import { projects } from "@/content/projects";
import { Section } from "./Section";
import { sections } from "./sections";
import styles from "./Projects.module.css";

export function Projects() {
  return (
    <Section id={sections.projects.id} title={sections.projects.label}>
      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.title}>
            <article className={styles.card}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className="tag-list" aria-label="Technologien">
                {project.technologies.map((technology) => (
                  <li key={technology} className="tag">
                    {technology}
                  </li>
                ))}
              </ul>
              <a href={project.githubUrl} className={styles.link} rel="noopener noreferrer">
                Code auf GitHub<span className="visually-hidden">: {project.title}</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
