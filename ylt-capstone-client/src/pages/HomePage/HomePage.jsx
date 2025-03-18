import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <div>Welcome to wander</div>
      <Link to="/select">Next</Link>
    </>
  );
}
