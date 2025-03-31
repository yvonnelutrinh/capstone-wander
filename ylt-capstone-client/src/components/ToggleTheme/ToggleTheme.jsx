import { useEffect, useState } from "react";
import axios from "axios";
import Color from "colorjs.io";
import "./ToggleTheme.scss";
import { SERVER_PORT, SERVER_URL } from "../../App";

export default function ToggleTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  }); // default to dark mode
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const applyTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const sendTheme = async (newTheme) => {
    await axios.post(`${SERVER_URL}:${SERVER_PORT}/theme`, {
      theme: newTheme,
    }); // Save default to backend
  };

  // check for browser default on initial load
  useEffect(() => {
    const setTheme = async () => {
      try {

        const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/theme`);
        if (
          response.data &&
          (response.data === "light" || response.data === "dark")
        ) {
          applyTheme(response.data);
        } else {
          // No theme in backend, use browser default
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          const defaultTheme = prefersDark ? "dark" : "light";
          applyTheme(defaultTheme);
          await sendTheme(defaultTheme);
        }
      } catch (error) {
        console.error("Error fetching theme from backend:", error);
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        applyTheme(prefersDark ? "dark" : "light");
      }
      // };
      setTheme();
    };
  }, []);
  // toggle theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (theme !== "") {
      sendTheme(theme);
    }
    document
      .querySelectorAll(".color-wrapper, .color-button")
      .forEach(adjustTextColor); // fix text contrast
  }, [theme]);

  // check for color contrast, adjust text
  function getElementColor(element, property) {
    const color = getComputedStyle(element).getPropertyValue(property).trim();
    return new Color(color || "#000000");
  }
  function getAccessibleTextColor(bgColor, initialTextColor) {
    let textColor = initialTextColor;

    let contrastRatio = bgColor.contrast(textColor, "WCAG21");
    if (contrastRatio >= 8.59) {
      return textColor;
    }
    // gradually adjust toward black/white until it passes contrast
    const contrastWithBlack = bgColor.contrast(new Color("black"), "WCAG21");
    const contrastWithWhite = bgColor.contrast(new Color("white"), "WCAG21");
    // define targetColor as black or white
    let targetColor;
    if (contrastWithBlack > contrastWithWhite) {
      targetColor = new Color("black"); // black provides better contrast
    } else {
      targetColor = new Color("white"); // white provides better contrast
    }

    let mixAmount = 0.2; // start blending at 20%
    let previousContrast = contrastRatio;

    for (let i = 0; i < 10; i++) {
      // arbitrary, limit to 10 iterations
      textColor = textColor.mix(targetColor, mixAmount); // adjust towards target black/white
      contrastRatio = bgColor.contrast(textColor, "WCAG21");

      // if contrast is improving, return new textColor
      if (contrastRatio >= 8.59) {
        return textColor;
      }

      // if contrast isn't improving, increase mix intensity
      if (contrastRatio <= previousContrast) {
        mixAmount += 0.2;
      }

      previousContrast = contrastRatio;
    }

    console.warn("Contrast did not reach 8.59. Returning best attempt.");
    return textColor;
  }
  function adjustTextColor(element) {
    const bgColor = getElementColor(element, "background-color");
    const textColor = getElementColor(element, "color");

    // use WCAG 2.1, contrast ratio of at least 4.5:1, ideally 8.59:1 for accessibility
    const contrastRatio = bgColor.contrast(textColor, "WCAG21");

    if (contrastRatio < 8.59) {
      const newtextColor = getAccessibleTextColor(bgColor, textColor);
      element.style.color = newtextColor.toString({ format: "hex" });
    }
  }

  return (
    <div className="theme-toggle">
      <button
        className="theme-toggle__button"
        onClick={toggleTheme}
        aria-label="toggle dark/light mode"
      >
        {theme === "dark" && "🌙"}
        {theme === "light" && "☀️"}
      </button>
    </div>
  );
}
