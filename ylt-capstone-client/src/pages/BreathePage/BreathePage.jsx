import { Link } from "react-router-dom";
import BreatheAnimation from "../../components/BreatheAnimation/BreatheAnimation";

export default function BreathePage() {
  return (
    <>
      <div>Breathe page</div>
      <BreatheAnimation />
      <Link to="/compare">Next</Link>
    </>
  );
}
