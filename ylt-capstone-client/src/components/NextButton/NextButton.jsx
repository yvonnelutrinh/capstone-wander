import { observer } from "mobx-react-lite";
import { Link, useLocation } from "react-router-dom";
import "./NextButton.scss";
import { IndexContext } from "../../data/IndexProvider";
import { useContext } from "react";

function NextButton() {
  let location = useLocation();
  const indexStore = useContext(IndexContext);

  function getNextPage({ pathname }) {
    if (pathname.startsWith("/end")) return "/";
    switch (pathname) {
      case "/":
        return "/select";
      case "/select":
        return "/ground";
      case "/ground":
        return "/breathe";
      case "/breathe":
        return "/compare";
      case "/compare":
        return "/insight";
      case "/insight":
        return "/end";
      case "/end":
        return "/";
      case "/*":
        return "/";

      default:
        return "/";
    }
  }
  const nextPath = getNextPage(location);
  return (
    <>
      <button
        onClick={() => (nextPath === "/" ? indexStore.setStarted(false) : null)}
        className="next-button"
      >
        <Link to={nextPath}>
          {nextPath === "/"
            ? "Home"
            : nextPath === "/breathe"
            ? "Begin"
            : nextPath === "/compare"
            ? "Continue"
            : "Next"}
        </Link>
      </button>
    </>
  );
}

export default observer(NextButton);
