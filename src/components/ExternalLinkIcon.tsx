/** Pfeil nach rechts oben hinter Links auf fremde Seiten. Rein dekorativ. */
export function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="0.75em"
      height="0.75em"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginInlineStart: "0.3em" }}
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  );
}
