import { Link } from "react-router-dom";
import RippleAnimation from "../../components/RippleAnimation/RippleAnimation";

export default function BreathePage() {
  return (
    <>
      <div>Breathe page</div>
      <RippleAnimation />
      <Link to="/compare">Next</Link>
    </>
  );
}
