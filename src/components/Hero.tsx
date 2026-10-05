import Image from "next/image";
import { profile } from "@/content/profile";
import styles from "./Hero.module.css";

export function Hero() {
  const { photo, tagline } = profile;

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
        {tagline && <p className={styles.tagline}>{tagline}</p>}
      </div>
    </section>
  );
}
