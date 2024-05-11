import links from "../utils/Links.js";
import linksAdmin from "../utils/LinksAdmin.js";
import { NavLink } from "react-router-dom";
import { useAppcontext } from "../context/appContext.js";
function NavLinks({ toggleSidebar }) {
  const { role } = useAppcontext();

  const linksToUse = role === "admin" ? linksAdmin : links;

  return (
    <div className="nav-links">
      {linksToUse.map((link) => {
        const { text, path, id, icon } = link;

        return (
          <NavLink
            to={path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            key={id}
            onClick={toggleSidebar}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
}
export default NavLinks;
