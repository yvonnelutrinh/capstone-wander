import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL, SERVER_PORT } from "../../App";
// TODO ADD SLOW FADE IN FOR WORDS
// TODO ADD BUTTON TO GET WORDS/REGENERATE
// TODO ADD BUTTON TO PONDER THESE WONDER
export default function Words() {
  const [words, setWords] = useState([]);

  async function fetchWords() {
    const response = await axios.get(`${SERVER_URL}:${SERVER_PORT}/words`);
    setWords(response.data);
  }
  return (
    <>
      {words.map((word, index) => (
        <div key={index}>{word}</div>
      ))}
      <button onClick={()=>fetchWords()}>{ words.length !== 0 ? "new words" : "get words"}</button>
    </>
  );
}
