// src/components/common/Navbar.js
import { NavLink, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import CoinIcon from "~/assets/icons/coin-icon";
import { useAuth } from "~/contexts/AuthContext";
import { Button } from "../ui/Button";

const Navbar = ({ iconType = "coin" }) => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Google log out error:", error);
    }
  };

  return (
    <nav className="p-4 sticky top-0 z-20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className="flex items-center px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <CoinIcon />
            <h1 className="text-xl">活潑分帳</h1>
          </NavLink>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser && (
            <>
              <p>Hi, {currentUser.displayName || "使用者"}!</p>
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage
                  src={currentUser.photoURL || undefined}
                  alt={currentUser.displayName || "使用者頭像"}
                />
                <AvatarFallback className="bg-accent">
                  {currentUser.displayName
                    ? currentUser.displayName[0].toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </>
          )}
          <Button
            className="px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            onClick={handleGoogleLogOut}
          >
            登出
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
