import React from "react";
import NavLinks from "./NavLinks";
import links from "../utils/Links.js";
function NavLs({ toggleSidebar }) {
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, id, icon } = link;

        return (
          <NavLinks
            to={path}
            key={id}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLinks>
        );
      })}
    </div>
  );
}

export default NavLs;
