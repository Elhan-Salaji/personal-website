import Image from "next/image";
import { emailLink, githubLink } from "@/content/contact";
import { profile } from "@/content/profile";
import { ExternalLinkIcon } from "./ExternalLinkIcon";
import { sections } from "./sections";
import styles from "./Hero.module.css";

export function Hero() {
  const { photo } = profile;

  return (
    <section aria-labelledby="hero-titel" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.heading}>
          <h1 id="hero-titel">{profile.name}</h1>
          <p className={styles.role}>{profile.role}</p>
        </div>
        {photo && (
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={styles.photo}
            priority
          />
        )}
        <div className={styles.body}>
          <p className={styles.tagline}>{profile.tagline}</p>
          <ul className={styles.links}>
            <li>
              <a href={`#${sections.projects.id}`}>Zu den Projekten</a>
            </li>
            <li>
              <a href={githubLink.href} rel="noopener noreferrer">
                {githubLink.label}
                <ExternalLinkIcon />
              </a>
            </li>
            <li>
              <a href={emailLink.href}>{emailLink.label}</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
