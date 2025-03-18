import { Link } from "react-router-dom";
import Words from "../../components/Words/Words";

export default function ComparisonPage() {
    return (
      <>
      <div>Comparison page</div>
      <Words />
      <Link to="/insight">Next</Link>
      </>
    );
  }
  