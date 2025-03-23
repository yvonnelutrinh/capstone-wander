import axios from "axios";
import { useState } from "react";
import { SERVER_URL, SERVER_PORT } from "../../App";
import CompareCard from "../CompareCard/CompareCard";
import "./Words.scss";
import Insight from "../Insight/Insight";

export default function Words() {
  const [words, setWords] = useState([]);

  async function fetchWords() {
    const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/words`);
    setWords(response.data);
  }
  return (
    <>
      <div className="words">
        {words.map((word, index) => (
          <CompareCard word={word} key={index} palette={null} />
        ))}
      </div>
      <div className="buttons">
        <button onClick={() => fetchWords()}>
          {words.length !== 0 ? "new words" : "get words"}
        </button>
        {words.length !== 0 && <button>ponder</button>}
      </div>
      <Insight />
    </>
  );
}
