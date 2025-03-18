import "./SelectionPage.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL, SERVER_PORT } from "../../App";

const defaultColors = [
  {
    name: "Sage Green",
    hex: "A8C6A2",
    description: "Represents renewal, nature, and tranquility.",
  },
  {
    name: "Misty Blue",
    hex: "A7C7E7",
    description: "Promotes relaxation and mental clarity.",
  },
  {
    name: "Muted Lavender",
    hex: "C2A8D5",
    description: "Balances creativity with a peaceful undertone.",
  },
  {
    name: "Warm Sand",
    hex: "D8C3A5",
    description: "A grounding neutral that offers warmth and comfort.",
  },
  {
    name: "Dusty Rose",
    hex: "E4B1AB",
    description: "Brings a sense of calm and gentle optimism.",
  },
];
// TODO: save these palettes to the backend database and map to generate a button for each

export default function SelectionsPage() {
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

  //   useEffect(() => {
  //     const generatePalette(()=> {

  //     })
  //   }, [palette])

  console.log(seedColor);
  console.log(palette);
  return (
    <>
      <div>
        <h1>Selections page</h1>
      </div>
      <div>
        <h2>Select a colour</h2>
        {defaultColors.map((color, index) => (
          <button
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
          {palette && palette.map((value, index) => (
            <div key={index} style={{ background: value }}>Colors</div>
          ))}
        </div>
        <Link to="/breathe">Next</Link>
      </div>
    </>
  );
}
