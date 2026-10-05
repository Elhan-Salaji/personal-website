import { contactIntro, contactLinks } from "@/content/contact";
import { Section } from "./Section";
import { sections } from "./sections";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <Section id={sections.contact.id} title={sections.contact.label}>
      <p>{contactIntro}</p>
      <address className={styles.address}>
        <dl className="facts">
          {contactLinks.map((link) => (
            <div key={link.label}>
              <dt>{link.label}</dt>
              <dd>
                <a href={link.href} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                  {link.text}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </address>
    </Section>
  );
}
