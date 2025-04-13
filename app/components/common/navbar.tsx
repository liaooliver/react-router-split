// src/components/common/Navbar.js
import { NavLink } from "react-router";
import CoinIcon from "~/assets/icons/coin-icon";

const Navbar = ({ iconType = "coin" }) => (
  <nav className="p-4 sticky top-0 z-20 bg-primary text-primary-foreground">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <CoinIcon />
        <h1 className="text-xl">活潑分帳</h1>
      </div>
      <div className="space-x-4">
        <NavLink
          to="/"
          className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          首頁
        </NavLink>
        <NavLink
          to="/dashboard"
          className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          總覽
        </NavLink>
      </div>
    </div>
  </nav>
);

export default Navbar;
