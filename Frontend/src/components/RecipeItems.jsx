import { useEffect, useState, useMemo } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

export default function RecipeItems() {
  // UseLoaderData is used to get the data from the server
  const recipes = useLoaderData();

  // initializing a state variable 'allRecipes' to hold all recipe data.
  const [allRecipes, setAllRecipes] = useState();

  // This line checks the current URL path to determine if the user is on the "/myRecipe" page.
  let path = window.location.pathname === "/myRecipe" ? true : false;

  // localStorage is a web storage API that allows us to store data in the browser.
  // We attempt to get the "fav" key from local storage, and if it doesn't exist, we default to an empty array ([])
  let favItems = useMemo(
    () => JSON.parse(localStorage.getItem("fav")) ?? [],
    []
  );

  // to track whether the current recipe is a favorite or not.
  // Use an object to track favorite status for each recipe
  const [favStatus, setFavStatus] = useState({});

  // useNavigate is a hook from React Router that provides a function to programmatically navigate
  const navigate = useNavigate();

  // To set the 'allRecipes' state whenever the 'recipes' data changes.
  useEffect(() => {
    setAllRecipes(recipes);
    // Initialize favorite status based on local storage
    const initialFavStatus = {};
    favItems.forEach((item) => {
      initialFavStatus[item._id] = true; // Mark as favorite
    });
    setFavStatus(initialFavStatus);
  }, [recipes, favItems]); // Include favItems to reinitialize when it changes // The effect runs whenever 'recipes' changes.

  // This function deletes a recipe by its ID from the server.
  const onDelete = async (id) => {
    await axios
      .delete(`https://food-blog-app.onrender.com/recipe/${id}`) // Send a DELETE request to the server.
      .then((res) => console.log(res));

    // Update the 'allRecipes' state to remove the deleted recipe from the UI.
    setAllRecipes((recipes) => recipes.filter((recipe) => recipe._id !== id));
    // Update the favorite items in local storage by filtering out the deleted recipe.
    let filterItem = favItems.filter((recipe) => recipe._id !== id);
    localStorage.setItem("fav", JSON.stringify(filterItem));
  };

  const favRecipe = (item) => {
    const isCurrentlyFav = favStatus[item._id] || false;

    // Toggle favorite status
    const newFavStatus = {
      ...favStatus,
      [item._id]: !isCurrentlyFav,
    };

    // Update local storage
    let updatedFavItems = isCurrentlyFav
      ? favItems.filter((recipe) => recipe._id !== item._id) // Remove from favorites
      : [...favItems, item]; // Add to favorites

    localStorage.setItem("fav", JSON.stringify(updatedFavItems));
    setFavStatus(newFavStatus); // Update state
  };

  return (
    <div className="contain">
      <div className="card-container">
        {allRecipes?.map((item, index) => {
          return (
            <div
              key={index}
              className="card"
              onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
              <img
                src={`https://food-blog-app.onrender.com/images/${item.coverImage}`}></img>
              <div className="card-body">
                <div className="title">{item.title}</div>
                <div className="icons">
                  <div className="timer">
                    <BsStopwatchFill />
                    {item.time}
                  </div>

                  {!path ? (
                    <FaHeart
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from bubbling up
                        favRecipe(item);
                      }}
                      style={{
                        color:
                          favItems.some((res) => res._id === item._id) ||
                          favStatus[item._id]
                            ? "red"
                            : "",
                      }}
                    />
                  ) : (
                    <div className="action">
                      <Link to={`/editRecipe/${item._id}`} className="editIcon">
                        <FaEdit />
                      </Link>
                      <MdDelete
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click event from bubbling up
                          onDelete(item._id);
                        }}
                        className="deleteIcon"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
