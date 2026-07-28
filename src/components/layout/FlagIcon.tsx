interface FlagIconProps {
  className?: string;
}

function starPolygon(cx: number, cy: number, outerR: number, innerR: number) {
  const points: string[] = [];

  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }

  return points.join(" ");
}

// Coordinates ported directly from the official flag artwork (16x8 unit grid):
// the yellow triangle is inset from both the left and right edges — a right angle
// at (12.24, 0), a flat top edge back to (4.24, 0), and a vertical edge down to
// (12.24, 8) — leaving a blue strip on the right. The nine white stars run along a
// line parallel to (and left of) that diagonal, stepping (+1, +1) each time, so the
// first and last are clipped by the top and bottom edges.
const BA_UNIT_W = 16;
const BA_UNIT_H = 8;
const BA_TRIANGLE_LEFT_X = 4.24;
const BA_TRIANGLE_RIGHT_X = 12.24;
const BA_STAR_START = { x: 2.8, y: 0 };
const BA_STAR_STEP = 1;
const BA_STAR_COUNT = 9;
const BA_STAR_OUTER_R = 0.72;
const BA_STAR_INNER_R = BA_STAR_OUTER_R * 0.382;

export function FlagGB({ className = "h-3.5 w-5" }: FlagIconProps) {
  return (
    <svg
      className={`shrink-0 rounded-[2px] ${className}`}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <clipPath id="gb-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="gb-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#gb-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 60,30 M60,0 0,30" clipPath="url(#gb-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function FlagBA({ className = "h-3.5 w-5" }: FlagIconProps) {
  const starPositions = Array.from({ length: BA_STAR_COUNT }, (_, index) => ({
    x: BA_STAR_START.x + index * BA_STAR_STEP,
    y: BA_STAR_START.y + index * BA_STAR_STEP,
  }));

  return (
    <svg
      className={`shrink-0 rounded-[2px] ${className}`}
      viewBox={`0 0 ${BA_UNIT_W} ${BA_UNIT_H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <clipPath id="ba-flag-clip">
        <rect width={BA_UNIT_W} height={BA_UNIT_H} rx="0.2" />
      </clipPath>

      <g clipPath="url(#ba-flag-clip)">
        <rect width={BA_UNIT_W} height={BA_UNIT_H} fill="#002395" />
        <path
          d={`M${BA_TRIANGLE_LEFT_X},0 H${BA_TRIANGLE_RIGHT_X} V${BA_UNIT_H} Z`}
          fill="#FECB00"
        />
        <g fill="#fff">
          {starPositions.map((position, index) => (
            <polygon
              key={index}
              points={starPolygon(position.x, position.y, BA_STAR_OUTER_R, BA_STAR_INNER_R)}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
