import Wrapper from "../assets/wrappers/SmallSidebar";
import { FaTimes } from "react-icons/fa";
import { useAppcontext } from "../context/appContext";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
function SmallSidebar() {
  const { ToggleSideBar, showSidebar } = useAppcontext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button className="close-btn" type="button" onClick={ToggleSideBar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks ToggleSideBar={ToggleSideBar} />
        </div>
      </div>
    </Wrapper>
  );
}

export default SmallSidebar;
