import profileImg from "../assets/profile.png";
import { useLoaderData } from "react-router-dom";

export default function RecipeDetails() {

  /* Represents the recipe data loaded by the useLoaderData hook.*/
  const recipe = useLoaderData();

  return (
    <>
      <div className="outer-container">

        <div className="profile">
          <img src={profileImg} width="50px" height="50px"></img>
          <h5>{recipe.email}</h5>
        </div>

        <h3 className="title">{recipe.title}</h3>

        <img
          src={`https://food-blog-app.onrender.com/images/${recipe.coverImage}`}
          width="220px"
          height="200px">
        </img>

        <div className="recipe-details">

          <div className="ingredients">
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients
                .filter((item) => item.trim() !== "") // Filter out any empty strings
                .map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
          </div>

          <div className="instructions">
            <h4>Instructions</h4>
            {recipe.instructions.split("\n").map((instruction, index) => (
              <span key={index}>
                {instruction}
                <br />
              </span>
            ))}
          </div>
          
        </div>
      </div>
    </>
  );
}
