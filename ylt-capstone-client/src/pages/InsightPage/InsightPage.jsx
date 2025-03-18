import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SERVER_URL, SERVER_PORT } from "../../App";
import AiResponse from "../../components/AiResponse/AiResponse";

export default function InsightPage() {
  const [insight, setInsight] = useState("");
  const [response, setResponse] = useState("");

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
        } catch (error) {
          console.error("Error receiving response:", error);
        }
      }
    };
    getResponse();
  }, [insight]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setInsight(event.target[0].value);
  };

  return (
    <>
      <div>Any insights?</div>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Submit Insight</button>
      </form>
      {response && <AiResponse response={response} />}
      <Link to="/end">Finish</Link>
    </>
  );
}
