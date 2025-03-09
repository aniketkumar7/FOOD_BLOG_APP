import foodRecipe from "../assets/recipe.png";
import { useState } from "react";
import RecipeItems from "../components/RecipeItems";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import InputForm from "../components/InputForm";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
      {/* <div className="bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#d4f6e8"
            fillOpacity="1"
            d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>
      </div> */}
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
