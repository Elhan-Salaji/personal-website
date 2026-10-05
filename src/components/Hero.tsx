import Image from "next/image";
import { profile } from "@/content/profile";
import { sections } from "./sections";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section aria-labelledby="hero-titel" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <Image
          src={profile.photo.src}
          alt={profile.photo.alt}
          width={profile.photo.width}
          height={profile.photo.height}
          className={styles.photo}
          priority
        />
        <div>
          <h1 id="hero-titel">{profile.name}</h1>
          <p className={styles.tagline}>{profile.tagline}</p>
          <div className={styles.actions}>
            <a href={`#${sections.projects.id}`} className="button">
              Projekte
            </a>
            <a href={`#${sections.contact.id}`} className="button button--secondary">
              Kontakt
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
