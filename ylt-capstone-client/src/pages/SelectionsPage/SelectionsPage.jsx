import "./SelectionPage.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL, SERVER_PORT } from "../../App";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";
import NextButton from "../../components/NextButton/NextButton";

// default colors for duotone gradient palette generation
const defaultColors = [
  {
    name: "Sunset",
    hex: "FF7E5F",
  },
  {
    name: "Ocean",
    hex: "2E3192",
  },
  {
    name: "Forest",
    hex: "134E5E",
  },
  {
    name: "Twilight",
    hex: "473B7B",
  },
  {
    name: "Ember",
    hex: "CC2B5E",
  },
];
// TODO: save these palettes to the backend database and map to generate a button for each

export default function SelectionsPage() {
  // select color/generate palette from backend
  const [seedColor, setSeedColor] = useState("");
  const [palette, setPalette] = useState([]);
  const getPalette = async () => {
    try {
      if (seedColor !== "") {
        // generate palette from seedColor
        const response = await axios.post(
          `${SERVER_URL}:${SERVER_PORT}/colors`,
          { seedColor }
        );
        setPalette(response.data);
      } else if (seedColor === "") {
        //generate random color palette
        const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/colors`);
        setPalette(response.data);
      }
    } catch (error) {
      console.error("Error generating color palette:", error);
    }
  };
  useEffect(() => {
    getPalette();
  }, [seedColor]);
  return (
    <>
    <ToggleTheme palette={palette}/>
      <div>
        <h2>Select a colour</h2>
        {defaultColors.map((color, index) => (
          <button
          className="color-button"
            onClick={() => setSeedColor(color.hex)}
            key={index}
            style={{ background: `#${color.hex}` }}
          >
            {color.name}
          </button>
        ))}
      </div>
      {/* add selected/active button styles*/}
      <button
        onClick={() => (seedColor !== "" ? setSeedColor("") : getPalette())}
      >
        Random
      </button>
      <div>
        <h2>Generated Palette</h2>
        <div>
          {palette &&
            palette.map((value, index) => (
              <div key={index} className="color-wrapper" style={{ background: value }}>
                Colors
              </div>
            ))}
        </div>
        <NextButton />
      </div>
    </>
  );
}
