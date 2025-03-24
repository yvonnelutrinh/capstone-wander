import axios from "axios";
import { useState } from "react";
import { SERVER_URL, SERVER_PORT } from "../../App";
import CompareCard from "../CompareCard/CompareCard";
import "./Words.scss";
import Insight from "../Insight/Insight";
import InfinityAnimation from "../InfinityAnimation/InfinityAnimation";

export default function Words() {
  const [words, setWords] = useState([]);
  const [showInsight, setShowInsight] = useState(false);

  async function fetchWords() {
    const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/words`);
    setWords(response.data);
  }

  const openInsight = () => {
    setShowInsight(true);
  };

  return (
    <>
      <div className="words">
        {words.map((word, index) => (
          <CompareCard word={word} key={index} palette={null} />
        ))}
      </div>
      {words.length !== 0 && <InfinityAnimation />}
      <div className="buttons">
        <button onClick={() => fetchWords()}>
          {words.length !== 0 ? "new words" : "get words"}
        </button>
        {words.length !== 0 && <button onClick={() => openInsight()}>ponder</button>}
      </div>
      {showInsight && <Insight />}
    </>
  );
}
