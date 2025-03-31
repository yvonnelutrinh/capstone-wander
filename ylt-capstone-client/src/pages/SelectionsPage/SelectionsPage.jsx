import "./SelectionsPage.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL, SERVER_PORT } from "../../App";
import NextButton from "../../components/NextButton/NextButton";

// default colors for duotone gradient palette generation
const defaultColors = [
  {
    name: "Horizon",
    hex: "A67C7C",
  },
  {
    name: "Dune",
    hex: "A8977D",
  },
  {
    name: "Trail",
    hex: "889878",
  },
  {
    name: "Ripple",
    hex: "7E96A6",
  },
  {
    name: "Twilight",
    hex: "B4A7BE",
  },
];

export default function SelectionsPage() {
  // select color/generate palette from backend
  const [seedColor, setSeedColor] = useState("");
  const [palette, setPalette] = useState([]);
  const getPalette = async () => {
    try {
      if (palette.length === 0) {
        //generate random color palette
        const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/colors`);
        setPalette(response.data);
      } else {
        const response = await axios.post(
          `${SERVER_URL}:${SERVER_PORT}/colors`,
          { seedColor }
        );
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
      <div className="select">
        <h1 className="select__title">Select a colour</h1>
        {defaultColors.map((color, index) => (
          <button
            onClick={() => setSeedColor(color.hex)}
            key={index}
            style={{ background: `#${color.hex}` }}
          >
            {color.name}
          </button>
        ))}
        <button
          onClick={() => {
            setSeedColor("");
            getPalette();
          }}
        >
          Random
        </button>
      </div>
      <div className="palettes">
        <h3 className="palettes__title">Generated Palette</h3>
        <div className="palettes__wrapper">
          {palette &&
            palette.map((value, index) => (
              <div
                key={index}
                className="palettes__color"
                style={{ background: value }}
              ></div>
            ))}
        </div>
        <NextButton />
      </div>
    </>
  );
}
