import { about } from "@/content/profile";
import { Section } from "./Section";
import { sections } from "./sections";

export function About() {
  return (
    <Section id={sections.about.id} title={sections.about.label}>
      {about.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </Section>
  );
}
