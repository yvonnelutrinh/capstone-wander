import axios from "axios";
import { useEffect, useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const SERVER_PORT = import.meta.env.VITE_SERVER_PORT;

export default function Words() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    async function fetchWords() {
      const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/words`);
      setWords(response.data);
    }
    fetchWords();
  }, []); 
  if (words.length === 0){
    return <>Loading words...</>
  }
  return <>{words.map((word, index) => <div key={index}>{word}</div>)}</>;
}
