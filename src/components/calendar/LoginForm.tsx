"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/kalender/actions";
import styles from "./LoginForm.module.css";

const initialState: LoginState = {};

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  if (!configured) {
    return <p>Der Kalender ist noch nicht eingerichtet.</p>;
  }

  return (
    <form action={formAction} className={styles.form}>
      <label htmlFor="kalender-passwort">Passwort</label>
      <input
        id="kalender-passwort"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        maxLength={256}
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "kalender-fehler" : undefined}
        className={styles.input}
      />
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Wird geprüft" : "Anmelden"}
      </button>
      <p id="kalender-fehler" role="alert" className={styles.error}>
        {state.error}
      </p>
    </form>
  );
}
