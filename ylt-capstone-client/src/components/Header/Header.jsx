// import { useState } from "react";
// import SettingsModal from "../Settings/Settings";
import "./Header.scss";
import ToggleTheme from "../ToggleTheme/ToggleTheme";
import { Link } from "react-router-dom";

export default function Header() {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };
  return (
    <header className="header">
      <Link to="/">
        <h1>wander</h1>
      </Link>
      {/* <button className="header__button" onClick={() => toggleModal()}> */}
      {/* <span>⚙️</span> */}
      {/* </button> */}
      <ToggleTheme />
      {/* <SettingsModal isModalOpen={isModalOpen} closeModal={toggleModal} /> */}
    </header>
  );
}
