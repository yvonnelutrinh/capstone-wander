import "./NextButton.scss";
import { Link, useLocation } from "react-router-dom";

export default function NextButton({ preclick }) {
  let location = useLocation();

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
      <button onClick={() => preclick && preclick()} className="next-button">
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
