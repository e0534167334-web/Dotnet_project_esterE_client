// איורי SVG קטנים ושמחים (בלי קבצי תמונה חיצוניים)

export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="var(--pink)" />
      <circle cx="32" cy="35" r="17" fill="#FFE3D3" />
      <circle cx="26" cy="33" r="2.6" fill="var(--ink)" />
      <circle cx="38" cy="33" r="2.6" fill="var(--ink)" />
      <circle cx="22" cy="38" r="2.6" fill="#FFB3BE" />
      <circle cx="42" cy="38" r="2.6" fill="#FFB3BE" />
      <path d="M27 40q5 4.5 10 0" stroke="var(--ink)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M32 18q5-7 9-2" stroke="var(--ink)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// מסך הפתיחה: תינוק על ענן, בלונים וכוכבים
export function WelcomeArt() {
  return (
    <svg viewBox="0 0 320 260" className="welcome-art" aria-hidden>
      <g className="float-slow">
        <ellipse cx="250" cy="60" rx="34" ry="40" fill="var(--sun)" />
        <path d="M250 100 q-6 30 6 60" stroke="#E8B04A" strokeWidth="2" fill="none" />
        <ellipse cx="200" cy="40" rx="26" ry="31" fill="var(--sky)" />
        <path d="M200 71 q8 40 -4 90" stroke="#5A9BE0" strokeWidth="2" fill="none" />
      </g>
      <g className="float-fast">
        <path d="M60 40 l4 9 10 1 -8 6 3 10 -9-5 -9 5 3-10 -8-6 10-1z" fill="var(--sun)" />
        <path d="M110 18 l3 6 7 1 -5 4 2 7 -7-4 -6 4 2-7 -5-4 7-1z" fill="var(--pink)" />
        <circle cx="290" cy="150" r="6" fill="var(--lavender)" />
        <circle cx="30" cy="120" r="5" fill="var(--mint)" />
      </g>
      {/* ענן */}
      <g>
        <ellipse cx="160" cy="215" rx="120" ry="34" fill="#fff" />
        <circle cx="95" cy="195" r="38" fill="#fff" />
        <circle cx="160" cy="180" r="50" fill="#fff" />
        <circle cx="225" cy="198" r="36" fill="#fff" />
      </g>
      {/* תינוק */}
      <g className="bob">
        <ellipse cx="160" cy="168" rx="46" ry="30" fill="var(--mint)" />
        <circle cx="160" cy="118" r="40" fill="#FFE3D3" />
        <path d="M150 80 q10-16 22-4" stroke="var(--ink)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="146" cy="116" r="4.5" fill="var(--ink)" />
        <circle cx="174" cy="116" r="4.5" fill="var(--ink)" />
        <circle cx="137" cy="128" r="6" fill="#FFB3BE" />
        <circle cx="183" cy="128" r="6" fill="#FFB3BE" />
        <path d="M150 133 q10 9 20 0" stroke="var(--ink)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="114" cy="160" r="11" fill="#FFE3D3" />
        <circle cx="206" cy="160" r="11" fill="#FFE3D3" />
      </g>
    </svg>
  );
}

// 409: שני הורים, משבצת אחת - איור "אופס" עם שעון
export function OopsArt() {
  return (
    <svg viewBox="0 0 200 140" className="oops-art" aria-hidden>
      <circle cx="100" cy="72" r="54" fill="var(--sun-soft)" />
      <g className="wiggle">
        <circle cx="100" cy="72" r="36" fill="#fff" stroke="var(--sun)" strokeWidth="6" />
        <path d="M100 72 V50 M100 72 L116 82" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="72" r="4" fill="var(--pink)" />
      </g>
      <path d="M40 30 l6 6 M160 30 l-6 6 M30 80 h8 M162 80 h8" stroke="var(--pink)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// מצב ריק: ארנב מציץ
export function EmptyArt() {
  return (
    <svg viewBox="0 0 160 120" className="empty-art" aria-hidden>
      <ellipse cx="80" cy="104" rx="58" ry="10" fill="var(--lavender-soft)" />
      <g className="bob">
        <ellipse cx="62" cy="34" rx="10" ry="26" fill="#fff" stroke="var(--lavender)" strokeWidth="4" />
        <ellipse cx="98" cy="34" rx="10" ry="26" fill="#fff" stroke="var(--lavender)" strokeWidth="4" />
        <circle cx="80" cy="74" r="32" fill="#fff" stroke="var(--lavender)" strokeWidth="4" />
        <circle cx="69" cy="70" r="4" fill="var(--ink)" />
        <circle cx="91" cy="70" r="4" fill="var(--ink)" />
        <ellipse cx="80" cy="82" rx="5" ry="3.5" fill="var(--pink)" />
      </g>
    </svg>
  );
}
