import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
            fontSize: 24,
            background: 'transparent',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" fill="none" width="100%" height="100%">
          <defs>
            <linearGradient id="blue_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C6FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#0072FF" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Basket Handle */}
          <path d="M160 120 L230 50 A 20 20 0 0 1 270 50 L340 120" stroke="url(#blue_gradient)" strokeWidth="35" strokeLinecap="round" fill="none"/>

          {/* Basket Body */}
          <path d="M100 120 H400 L370 260 H130 Z" fill="url(#blue_gradient)" stroke="url(#blue_gradient)" strokeWidth="30" strokeLinejoin="round"/>
          
          {/* Basket Holes (White to simulate cutout) */}
          <g fill="#ffffff">
            <rect x="155" y="140" width="30" height="40" rx="10" />
            <rect x="205" y="140" width="30" height="40" rx="10" />
            <rect x="265" y="140" width="30" height="40" rx="10" />
            <rect x="315" y="140" width="30" height="40" rx="10" />
            
            <rect x="155" y="200" width="30" height="40" rx="10" />
            <rect x="205" y="200" width="30" height="40" rx="10" />
            <rect x="265" y="200" width="30" height="40" rx="10" />
            <rect x="315" y="200" width="30" height="40" rx="10" />
          </g>

          {/* Wheels and Axle */}
          <g transform="translate(0, 290)">
             <path d="M170 35 H330" stroke="url(#blue_gradient)" strokeWidth="30" strokeLinecap="round" />
             <circle cx="170" cy="35" r="35" stroke="url(#blue_gradient)" strokeWidth="20" fill="none" />
             <circle cx="330" cy="35" r="35" stroke="url(#blue_gradient)" strokeWidth="20" fill="none" />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
