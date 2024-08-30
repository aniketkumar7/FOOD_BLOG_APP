import { useEffect, useState } from 'react'
import Modal from "./Modal"
import InputForm from "./InputForm"
import { NavLink } from "react-router-dom"
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Menu from './Menu';

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(token ? false : true);
  // let user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setIsLogin(token ? false : true);
  }, [token]);

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLogin(true);
      navigate("/");
    } else {
      setIsOpen(true);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header>
        <h2 onClick={() => navigate("/")}>Food Blog</h2>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink>
          </li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/favRecipe" : "/"}>Favourites</NavLink>
          </li>
          <li onClick={checkLogin}>
            <p className="login">
              {isLogin ? "Login" : "Logout"}
              {/* {user?.email ? `(${user?.email})` : ""} */}
            </p>
          </li>
        </ul>
        <button className="menu-button" onClick={toggleMenu}>
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </header>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
      <div className={`menu-over ${isMenuOpen ? "open" : ""}`}>
        <button className="menu-button close" onClick={toggleMenu}>
          {isMenuOpen ? "Close" : "Menu"}
        </button>
        <Menu isLogin={isLogin} onLoginClick={checkLogin} />
      </div>
    </>
  );
}
export default Navbar