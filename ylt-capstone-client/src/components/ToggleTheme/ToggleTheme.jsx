import { useEffect, useState } from "react";
import Color from "colorjs.io";
import "./ToggleTheme.scss";

export default function ToggleTheme({ palette }) {
  const [theme, setTheme] = useState("dark"); // default to dark mode
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // check for browser default on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);
  // toggle theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (palette) {
      console.log(palette)
      document.documentElement.setAttribute("data-palette", palette);
      localStorage.setItem("palette", palette);
    }
    document
      .querySelectorAll(".color-wrapper, .color-button")
      .forEach(adjustTextColor); // fix text contrast
  }, [theme, palette]);

  // check for color contrast, adjust text
  function getElementColor(element, property) {
    const color = getComputedStyle(element).getPropertyValue(property).trim();
    return new Color(color || "#000000");
  }
  function getAccessibleTextColor(bgColor, initialTextColor) {
    console.log("running get accessible text color with bg color");
    let textColor = initialTextColor;
    console.log(`initial text color: ${textColor.toString({ format: "hex" })}`);
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
    console.log("element:", element);
    console.log("bg", bgColor.toString({ format: "hex" }));
    console.log("text", textColor.toString({ format: "hex" }));

    // use WCAG 2.1, contrast ratio of at least 4.5:1, ideally 8.59:1 for accessibility
    const contrastRatio = bgColor.contrast(textColor, "WCAG21");

    if (contrastRatio < 8.59) {
      console.log("low contrast detected:", contrastRatio);

      const newtextColor = getAccessibleTextColor(bgColor, textColor);
      element.style.color = newtextColor.toString({ format: "hex" });
      console.log("new text color:", newtextColor.toString({ format: "hex" }));
    }
  }

  return (
    <div className="theme-toggle">
      <button
        className="theme-toggle__button"
        onClick={toggleTheme}
        aria-label="toggle dark/light mode"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
