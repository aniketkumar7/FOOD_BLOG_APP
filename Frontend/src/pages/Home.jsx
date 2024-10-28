import foodRecipe from "../assets/home.png";
import { useState } from "react";
import RecipeItems from "../components/RecipeItems";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import InputForm from "../components/InputForm";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Add recipe
  const addRecipe = () => {
    let token = localStorage.getItem("token");
    if (token) navigate("/addRecipe");
    else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <section className="home">
        <div className="left">
          <h1>The Easiest Way To Make Your Favourite Meal</h1>
          <h5>
            Discover the best recipes from all around the world.
            <br />
            Share your own recipe with us and inspire others.
          </h5>
          <button onClick={addRecipe}>Share your recipe</button>
        </div>
        <div className="right">
          <img src={foodRecipe}></img>
        </div>
      </section>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
      <div className="showcase">
        <div className="showcase-text">
          <h1>BreakFast Recipes that very quick and easy</h1>
          <p>Find the perfect food ideas to start your day with the quick and easiest way.</p>
        </div>
      </div>
      <div className="recipe-header">
        <h1>Recipes</h1>
      </div>
      <div className="recipe">
        <RecipeItems />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
