import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// Menu component
// This component renders the menu items for the application
// It takes two props:
//   isLogin: a boolean indicating whether the user is logged in or not
//   onLoginClick: a function to handle the login/logout click event
const Menu = ({ isLogin, onLoginClick }) => {
  return (
    <ul className="menu-contain">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li onClick={() => isLogin && onLoginClick()}>
        <NavLink to={!isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink>
      </li>
      <li onClick={() => isLogin && onLoginClick()}>
        <NavLink to={!isLogin ? "/favRecipe" : "/"}>Favourites</NavLink>
      </li>
      <li onClick={onLoginClick}>
        <p className="login">{isLogin ? "Login" : "Logout"}</p>
      </li>
    </ul>
  );
};


// props validation
Menu.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  onLoginClick: PropTypes.func.isRequired,
}
export default Menu;
