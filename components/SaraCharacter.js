export default function SaraCharacter({ isTalking = false }) {
  return (
    <svg
      width="180"
      height="220"
      viewBox="0 0 180 220"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(201,168,76,0.25))' }}
    >
      {/* Body / Saree */}
      <ellipse cx="90" cy="185" rx="52" ry="38" fill="#8B1A6B" />
      <ellipse cx="90" cy="175" rx="44" ry="30" fill="#A0208A" />

      {/* Saree drape detail */}
      <path d="M55 165 Q90 155 125 165 Q120 185 90 190 Q60 185 55 165Z" fill="#C9A84C" opacity="0.6" />
      <path d="M62 168 Q90 160 118 168" stroke="#E8C96A" strokeWidth="1.5" fill="none" opacity="0.8" />
      <path d="M60 173 Q90 165 120 173" stroke="#E8C96A" strokeWidth="1" fill="none" opacity="0.6" />

      {/* Neck */}
      <rect x="82" y="128" width="16" height="20" rx="6" fill="#C8956A" />

      {/* Head */}
      <ellipse cx="90" cy="108" rx="38" ry="42" fill="#C8956A" />

      {/* Hair */}
      <ellipse cx="90" cy="72" rx="38" ry="22" fill="#1A0A00" />
      <ellipse cx="90" cy="68" rx="34" ry="18" fill="#2A1000" />

      {/* Hair bun */}
      <ellipse cx="118" cy="80" rx="12" ry="10" fill="#1A0A00" />
      <circle cx="118" cy="78" r="5" fill="#C9A84C" />
      <circle cx="116" cy="76" r="2" fill="#E8C96A" />

      {/* Jasmine flowers in hair */}
      <circle cx="104" cy="72" r="3" fill="white" opacity="0.9" />
      <circle cx="110" cy="70" r="2.5" fill="white" opacity="0.9" />
      <circle cx="115" cy="73" r="2" fill="white" opacity="0.9" />

      {/* Eyes */}
      <ellipse cx="76" cy="108" rx="7" ry="7.5" fill="white" />
      <ellipse cx="104" cy="108" rx="7" ry="7.5" fill="white" />
      <circle cx="77" cy="109" r="4.5" fill="#1A0A00" />
      <circle cx="105" cy="109" r="4.5" fill="#1A0A00" />
      <circle cx="78.5" cy="107.5" r="1.5" fill="white" />
      <circle cx="106.5" cy="107.5" r="1.5" fill="white" />

      {/* Eyelashes */}
      <path d="M70 103 Q76 100 82 103" stroke="#1A0A00" strokeWidth="1.5" fill="none" />
      <path d="M98 103 Q104 100 110 103" stroke="#1A0A00" strokeWidth="1.5" fill="none" />

      {/* Eyebrows */}
      <path d="M69 100 Q76 96 83 100" stroke="#1A0A00" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M97 100 Q104 96 111 100" stroke="#1A0A00" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="90" cy="118" rx="3" ry="2" fill="#B07850" />

      {/* Mouth - changes when talking */}
      {isTalking ? (
        <ellipse cx="90" cy="128" rx="9" ry="6" fill="#8B2040" />
      ) : (
        <path d="M81 127 Q90 133 99 127" stroke="#8B2040" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}

      {/* Bindi */}
      <circle cx="90" cy="95" r="3" fill="#C9A84C" />
      <circle cx="90" cy="95" r="1.5" fill="#E8C96A" />

      {/* Earrings */}
      <circle cx="52" cy="112" r="5" fill="#C9A84C" />
      <circle cx="52" cy="112" r="3" fill="#E8C96A" />
      <circle cx="128" cy="112" r="5" fill="#C9A84C" />
      <circle cx="128" cy="112" r="3" fill="#E8C96A" />

      {/* Necklace */}
      <path d="M70 138 Q90 148 110 138" stroke="#C9A84C" strokeWidth="2" fill="none" />
      <circle cx="90" cy="146" r="4" fill="#C9A84C" />
      <circle cx="90" cy="146" r="2.5" fill="#E8C96A" />

      {/* Arms */}
      <path d="M45 160 Q30 170 35 190" stroke="#C8956A" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M135 160 Q150 170 145 190" stroke="#C8956A" strokeWidth="14" fill="none" strokeLinecap="round" />

      {/* Bangles */}
      <ellipse cx="34" cy="183" rx="8" ry="4" fill="none" stroke="#C9A84C" strokeWidth="2" />
      <ellipse cx="34" cy="179" rx="8" ry="4" fill="none" stroke="#8B1A6B" strokeWidth="2" />
      <ellipse cx="146" cy="183" rx="8" ry="4" fill="none" stroke="#C9A84C" strokeWidth="2" />
      <ellipse cx="146" cy="179" rx="8" ry="4" fill="none" stroke="#8B1A6B" strokeWidth="2" />

      {/* Talking indicator dots */}
      {isTalking && (
        <g>
          <circle cx="78" cy="210" r="3" fill="#C9A84C" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="90" cy="210" r="3" fill="#C9A84C" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
          </circle>
          <circle cx="102" cy="210" r="3" fill="#C9A84C" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
          </circle>
        </g>
      )}
    </svg>
  )
}
