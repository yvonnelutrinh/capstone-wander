import { useState, createContext, useContext } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  <SettingsContext.Provider value={{ isModalOpen, openModal, closeModal }}>
    {children}
  </SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);

export default function SettingsModal() {
  const { isModalOpen, closeModal } = useSettings();

  if (!isModalOpen) return null;

  return (
    <>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>Settings</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </>
  );
}
