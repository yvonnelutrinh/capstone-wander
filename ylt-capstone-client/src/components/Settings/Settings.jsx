import Modal from "react-modal";

Modal.setAppElement("#root");

export default function SettingsModal({isModalOpen, closeModal}) {
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
