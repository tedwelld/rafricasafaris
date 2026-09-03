"use client";

import { useEffect, useState } from "react";

/**
 * Animated day/night theme switch (markup from Uiverse.io by RiccardoRapelli).
 * Toggles the `dark` class on <html> and remembers the choice in localStorage.
 * Checked = dark/night. Initial state is synced from the class set by the
 * no-flash script in the root layout.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync the control to the theme class the no-flash script set pre-hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const el = document.documentElement;
    el.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore storage failures (private mode) */
    }
  };

  return (
    <label className="switch" title="Toggle light / dark theme">
      <input
        id="input"
        type="checkbox"
        checked={isDark}
        onChange={toggle}
        aria-label="Toggle dark mode"
      />
      <div className="slider round">
        <div className="sun-moon">
          <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>

          <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>
        <div className="stars">
          <svg id="star-1" className="star" viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg id="star-2" className="star" viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg id="star-3" className="star" viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg id="star-4" className="star" viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
        </div>
      </div>
    </label>
  );
}
