import { useState } from "react";
import SettingsModal from "../Settings/Settings";
import "./Header.scss";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <header className="header">
      <h1 >wander</h1>
      <button className="header__button" onClick={() => toggleModal()}>
        <span>⚙️</span>
      </button>
      <SettingsModal isModalOpen={isModalOpen} closeModal={toggleModal} />
    </header>
  );
}
