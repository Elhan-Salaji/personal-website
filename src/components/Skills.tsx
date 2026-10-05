import { skillGroups } from "@/content/skills";
import { Section } from "./Section";
import { sections } from "./sections";

export function Skills() {
  return (
    <Section id={sections.skills.id} title={sections.skills.label}>
      <dl className="facts">
        {skillGroups.map((group) => (
          <div key={group.area}>
            <dt>{group.area}</dt>
            <dd>{group.skills.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
