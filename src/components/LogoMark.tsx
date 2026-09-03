import { cn } from "@/lib/cn";

/**
 * Rise Africa Safaris emblem — dark green badge with acacia silhouette.
 */
export function LogoMark({
  idPrefix = "logo",
  className,
}: {
  idPrefix?: string;
  className?: string;
}) {
  const sky = `${idPrefix}-sky`;
  const arc = `${idPrefix}-arc`;
  const clip = `${idPrefix}-clip`;

  return (
    <svg
      viewBox="0 0 240 240"
      className={cn("h-auto w-auto", className)}
      role="img"
      aria-label="Rise Africa Safaris"
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#95b8a4" />
          <stop offset="55%" stopColor="#2d6a4f" />
          <stop offset="100%" stopColor="#1b4332" />
        </linearGradient>
        <path id={arc} d="M 35,112 A 85,85 0 0 1 205,112" fill="none" />
        <clipPath id={clip}>
          <circle cx="120" cy="112" r="64" />
        </clipPath>
      </defs>

      <circle cx="120" cy="112" r="106" fill="#0b0f0d" />
      <circle cx="120" cy="112" r="101" fill="#1b4332" />
      <circle cx="120" cy="112" r="98" fill="none" stroke="#95b8a4" strokeWidth="1.5" />
      <circle cx="120" cy="112" r="69" fill="#0f1c15" />
      <circle cx="120" cy="112" r="65" fill="#2d6a4f" />

      <g clipPath={`url(#${clip})`}>
        <rect x="54" y="46" width="132" height="132" fill={`url(#${sky})`} />
        <circle cx="118" cy="120" r="28" fill="#f2f6f3" opacity="0.9" />
        <path d="M54,150 Q86,138 120,148 T186,150 L186,178 L54,178 Z" fill="#0f1c15" />
        <path d="M54,160 Q100,150 140,160 T186,162 L186,178 L54,178 Z" fill="#0b0f0d" />
        <g fill="#0b0f0d">
          <rect x="147.5" y="118" width="3.2" height="52" />
          <ellipse cx="150" cy="113" rx="26" ry="6" />
          <ellipse cx="150" cy="108" rx="16" ry="5" />
        </g>
      </g>

      <text
        x="120"
        y="78"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontSize="11"
        fontWeight="700"
        fill="#f2f6f3"
      >
        Safaris
      </text>

      <text
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="2"
        fill="#f2f6f3"
      >
        <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">
          RISE AFRICA
        </textPath>
      </text>

      <g>
        <path d="M24,186 L40,180 L40,210 L24,204 Z" fill="#0b0f0d" />
        <path d="M216,186 L200,180 L200,210 L216,204 Z" fill="#0b0f0d" />
        <rect x="36" y="178" width="168" height="32" rx="4" fill="#0f1c15" stroke="#95b8a4" strokeWidth="1.5" />
        <text
          x="120"
          y="199"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="14"
          fontWeight="700"
          letterSpacing="2"
          fill="#f2f6f3"
        >
          KNOW THE BUSH
        </text>
      </g>
    </svg>
  );
}
