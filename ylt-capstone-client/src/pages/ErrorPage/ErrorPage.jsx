import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <>
          <div>This page does not exist!</div>
          {/*TODO/FUTURE: google fonts uses kaomojis for searches with no results e.g. (·_·) (^-^*) (>_<) (='X'=) (·.·) (;-;)*/}
          <Link to="/">Return to home</Link>
        </>)
}