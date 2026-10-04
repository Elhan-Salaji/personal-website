import { contactIntro, contactLinks } from "@/content/contact";
import { Section } from "./Section";
import { sections } from "./sections";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <Section id={sections.contact.id} title={sections.contact.label}>
      <p>{contactIntro}</p>
      <ul className={styles.list}>
        {contactLinks.map((link) => (
          <li key={link.label}>
            <span className={styles.label}>{link.label}</span>
            <a href={link.href} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
