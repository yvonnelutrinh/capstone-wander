import { useParams } from "react-router-dom";
import Slide from "../../components/Slide/Slide";
import "./EndPage.scss";

export default function EndPage() {
  const { insight } = useParams();

  return (
    <>
      <Slide />
      <div className="proverb">
        {insight
          ? insight
          : "A wandering mind finds unseen paths; the journey within reveals the way forward."}
      </div>
    </>
  );
}
