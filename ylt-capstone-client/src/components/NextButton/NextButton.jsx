import "./NextButton.scss";
import { Link } from "react-router-dom";

export default function NextButton() {
  return (
    <>
      <button className="next-button">
        <Link to="/select">Next</Link>
      </button>
    </>
  );
}
