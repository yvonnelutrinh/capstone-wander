import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_PORT, SERVER_URL } from "../../App";
import CompareCard from "../CompareCard/CompareCard";
import InfinityAnimation from "../InfinityAnimation/InfinityAnimation";
import "./Words.scss";

export default function Words({ showWordButtons, setShowInsight }) {
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
      {words.length !== 0 && <InfinityAnimation />}
      {showWordButtons && (
        <div className="buttons">
          {isFetching && <button onClick={stopFetching}>Stop</button>}

          {!isFetching && isStopped && (
            <>
              <button
                onClick={() => {
                  setIsFetching(true);
                  setIsStopped(false);
                }}
              >
                Regenerate Words
              </button>
            </>
          )}
        </div>
      )}
      <div className="words">
        {words.map((word, index) => (
          <CompareCard word={word} key={index} palette={null} />
        ))}
      </div>
    </>
  );
}
