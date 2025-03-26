import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_PORT, SERVER_URL } from "../../App";
import CompareCard from "../CompareCard/CompareCard";
import InfinityAnimation from "../InfinityAnimation/InfinityAnimation";
import "./Words.scss";
import LineFlickerAnimation from "../LineFlickerAnimation/LineFlickerAnimation";

export default function Words({
  showWordButtons,
  setShowInsight,
  wordsFinalized,
}) {
  const [words, setWords] = useState([]);
  const [isFetching, setIsFetching] = useState(true); // start fetching immediately
  const [isStopped, setIsStopped] = useState(false);

  async function fetchWords() {
    try {
      const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/words`);
      setWords(response.data);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  }

  useEffect(() => {
    fetchWords(); // fetch immediately on load

    if (isFetching) {
      const interval = setInterval(fetchWords, 100); // fetch every 100ms
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setIsFetching(false);
        setIsStopped(true); // mark that fetching has stopped
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isFetching]);

  const stopFetching = () => {
    setIsFetching(false);
    setIsStopped(true); // make sure ui updates for manual stop, same as auto stop
  };

  return (
    <>
      <LineFlickerAnimation />
      {/* {words.length !== 0 && <LineFlickerAnimation />} */}
      {showWordButtons && (
        <div className="words">
          <CompareCard word={words[0]} />
          {!wordsFinalized && (
            <div className="buttons">
              {isFetching && <button onClick={stopFetching}>■</button>}
              {!isFetching && isStopped && (
                <>
                  <button
                    onClick={() => {
                      setIsFetching(true);
                      setIsStopped(false);
                    }}
                  >
                    ♻
                  </button>
                </>
              )}
            </div>
          )}
          <CompareCard word={words[1]} />
        </div>
      )}
    </>
  );
}
