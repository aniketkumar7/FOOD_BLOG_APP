import { useEffect, useState } from "react";
import Modal from "./Modal";
import InputForm from "./InputForm";
import { NavLink, useNavigate } from "react-router-dom";
import Menu from "./Menu";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Initialize login state based on token existence
  const [isLogin, setIsLogin] = useState(!localStorage.getItem("token"));

  // Navigation items configuration
  const navItems = [
    { path: "/", label: "Home" },
    {
      path: "/myRecipe",
      label: "My Recipe",
      requiresAuth: true,
    },
    {
      path: "/favRecipe",
      label: "Favourites",
      requiresAuth: true,
    },
  ];

  // Update login state whenever token changes
  useEffect(() => {
    const handleLoginState = () => {
      const token = localStorage.getItem("token");
      setIsLogin(!token);
    };

    // Initial check
    handleLoginState();

    // Add event listener for storage changes
    window.addEventListener("storage", handleLoginState);

    return () => {
      window.removeEventListener("storage", handleLoginState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogin(true);
    navigate("/");
  };

  const handleAuthAction = () => {
    if (isLogin) {
      // If not logged in, show login modal
      setIsOpen(true);
    } else {
      // If logged in, handle logout
      handleLogout();
    }
  };

  const handleLoginSuccess = () => {
    setIsLogin(false);
    setIsOpen(false);
  };

  const renderNavItems = () => {
    return navItems.map(({ path, label, requiresAuth }) => (
      <li
        key={path}
        onClick={() => {
          if (requiresAuth && isLogin) {
            setIsOpen(true);
          }
        }}>
        <NavLink to={requiresAuth && isLogin ? "/" : path}>{label}</NavLink>
      </li>
    ));
  };

  return (
    <>
      <header>
        <h2 onClick={() => navigate("/")}>Foodie</h2>
        <nav>
          <ul>
            {renderNavItems()}
            <li onClick={handleAuthAction}>
              <p className="login">{isLogin ? "Login" : "Logout"}</p>
            </li>
          </ul>
        </nav>
        <button
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {/* Login Modal */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm
            onLoginSuccess={handleLoginSuccess}
            setIsOpen={setIsOpen}
          />
        </Modal>
      )}

      {/* Mobile Menu */}
      <div className={`menu-over ${isMenuOpen ? "open" : ""}`}>
        <button
          className="menu-button close"
          onClick={() => setIsMenuOpen(false)}>
          Close
        </button>
        <Menu isLogin={isLogin} onLoginClick={handleAuthAction} />
      </div>
    </>
  );
};

export default Navbar;
