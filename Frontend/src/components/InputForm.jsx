import { PropTypes } from "prop-types";
import { useState } from "react";
import axios from "axios";

export default function InputForm({ setIsOpen, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isSignUp ? "signUp" : "login";

    try {
      const response = await axios.post(
        `https://recipeapp-vut0.onrender.com/${endpoint}`,
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLoginSuccess?.();
      setIsOpen();
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h2>
      <form className="form" onSubmit={handleOnSubmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className={`submit-button ${isLoading ? "loading" : ""}`}
          disabled={isLoading}>
          {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
        </button>

        <div className="toggle-form">
          <p onClick={() => setIsSignUp((prev) => !prev)}>
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </p>
        </div>
      </form>
    </div>
  );
}

InputForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func,
};
