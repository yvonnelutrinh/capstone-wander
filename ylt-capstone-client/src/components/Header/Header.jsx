import { useState } from "react";
import SettingsModal from "../Settings/Settings";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <header className="header">
      <h1 className="header__logo">wander</h1>
      <button className="header__button" onClick={() => toggleModal()}>
        <span className="header__icon">⚙️</span>
      </button>
      <SettingsModal isModalOpen={isModalOpen} closeModal={toggleModal} />
    </header>
  );
}
