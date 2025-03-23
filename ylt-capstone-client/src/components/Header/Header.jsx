import { useContext } from "react";
import SettingsModal, { SettingsContext } from "../Settings/Settings";

export default function Header() {
const settingz = useContext(SettingsContext);
  // const settings = useSettings();
  console.log(settingz);
  console.log("test");
  // return (
  //   <header className="header">
  //     <h1 className="header__logo">wander</h1>
  //     <button className="header__button" onClick={openModal}>
  //       <span className="header__icon">⚙️</span> Settings
  //     </button>
  //   </header>
  // );
  return <div>header</div>;
}
