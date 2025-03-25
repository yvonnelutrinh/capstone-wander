import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_PORT, SERVER_URL } from "../../App";
import "./Insight.scss";

export default function Insight() {
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
  const handleSubmit = (event) => {
    event.preventDefault();
    setInsight(event.target[0].value);
  };

  return (
    <>
      <main className="insight">
        <h2>what are your thoughts?</h2>
        <form className="insight__form" onSubmit={handleSubmit}>
          <input type="text" />
          <button type="submit" className="insight__button" >
            Submit
          </button>
        </form>
      </main>
    </>
  );
}
