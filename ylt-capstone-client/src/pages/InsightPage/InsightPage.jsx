import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL, SERVER_PORT } from "../../App";
import AiResponse from "../../components/AiResponse/AiResponse";
import NextButton from "../../components/NextButton/NextButton";
import "./InsightPage.scss";
import { useNavigate } from "react-router-dom";
import ToggleTheme from "../../components/ToggleTheme/ToggleTheme";

export default function InsightPage() {
  const [insight, setInsight] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getResponse = async () => {
      if (insight !== "") {
        try {
          const response = await axios.post(
            `${SERVER_URL}:${SERVER_PORT}/insight`,
            {
              insight: insight,
            }
          );
          setResponse(response.data);
          navigate(`/end/${response.data}`);
        } catch (error) {
          console.error("Error receiving response:", error);
        }
      }
    };
    getResponse();
  }, [insight]);
  // TODO: add loading state
  const handleSubmit = (event) => {
    event.preventDefault();
    setInsight(event.target[0].value);
  };

  return (
    <>
      <ToggleTheme />
      <main className="insight">
        <h1>Any insights?</h1>
        <form className="insight__form" onSubmit={handleSubmit}>
          <input type="text" />
          <button type="submit" className="submit-button">
            Submit Insight
          </button>
        </form>
        {response && <AiResponse response={response} />}
      </main>
      <NextButton />
    </>
  );
}
