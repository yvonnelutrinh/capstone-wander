import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_PORT, SERVER_URL } from "../../App";
import "./Insight.scss";
import { observer } from "mobx-react-lite";
import { IndexContext } from "../../data/IndexProvider";

function Insight() {
  const [insight, setInsight] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const indexStore = useContext(IndexContext);

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
    indexStore.setIndex(0);
    setInsight(event.target[0].value);
  };

  return (
    <>
      <main className="insight">
        <form className="insight__form" onSubmit={handleSubmit}>
          <input type="text" />
          <button type="submit" className="insight__button">
            Submit
          </button>
        </form>
      </main>
    </>
  );
}

export default observer(Insight);
