import React from "react";

function AuthBackground({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6FBFD]">
      {/* Soft blue glow - top left */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#BFEAF5]/40 blur-3xl sm:h-96 sm:w-96" />

      {/* Soft blue glow - top right */}
      <div className="pointer-events-none absolute -right-32 top-20 h-64 w-64 rounded-full bg-[#DDF6FB]/60 blur-3xl sm:h-80 sm:w-80" />

      {/* Floating water drops / bubbles */}
      <div className="pointer-events-none absolute left-[8%] top-[25%] h-5 w-5 rounded-full bg-[#BFEAF5]/40 blur-[1px] sm:h-7 sm:w-7" />

      <div className="pointer-events-none absolute right-[10%] top-[32%] h-8 w-8 rounded-full bg-[#9DDEEC]/25 blur-[1px] sm:h-10 sm:w-10" />

      <div className="pointer-events-none absolute left-[15%] top-[55%] h-3 w-3 rounded-full bg-[#08779D]/15 sm:h-5 sm:w-5" />

      <div className="pointer-events-none absolute right-[18%] top-[60%] h-4 w-4 rounded-full bg-[#BFEAF5]/45 sm:h-6 sm:w-6" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>

      {/* Water wave layers */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full overflow-hidden sm:h-40 md:h-48">
        {/* Back wave */}
        <svg
          className="absolute bottom-0 h-full w-[150%] min-w-[900px] -translate-x-[15%] sm:w-[130%] sm:-translate-x-[10%]"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 125C180 55 340 55 520 120C700 185 850 185 1030 110C1210 35 1320 55 1440 95V260H0V125Z"
            fill="#DDF6FB"
          />
        </svg>

        {/* Middle wave */}
        <svg
          className="absolute bottom-0 h-[85%] w-[145%] min-w-[850px] -translate-x-[12%] sm:w-[125%] sm:-translate-x-[8%]"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 165C190 90 350 95 540 155C730 215 880 205 1050 135C1220 65 1330 90 1440 125V260H0V165Z"
            fill="#BFEAF5"
            fillOpacity="0.65"
          />
        </svg>

        {/* Front wave */}
        <svg
          className="absolute bottom-0 h-[65%] w-[140%] min-w-[800px] -translate-x-[10%] sm:w-[120%] sm:-translate-x-[6%]"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 190C170 125 350 125 525 180C700 235 850 230 1025 165C1200 100 1325 115 1440 150V260H0V190Z"
            fill="#9DDEEC"
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}

export default AuthBackground;