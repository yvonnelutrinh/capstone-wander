import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL, SERVER_PORT } from "../../App";

export default function Words() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    async function fetchWords() {
      const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/words`);
      setWords(response.data);
    }
    fetchWords();
  }, []);
  if (words.length === 0) {
    return <>Loading words...</>;
  }
  return (
    <>
      {words.map((word, index) => (
        <div key={index}>{word}</div>
      ))}
    </>
  );
}
