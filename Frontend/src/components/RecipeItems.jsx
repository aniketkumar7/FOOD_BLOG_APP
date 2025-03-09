import { useEffect, useState, useMemo } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";


export default function RecipeItems() {
  const recipes = useLoaderData();
  const navigate = useNavigate();
  const isMyRecipePage = window.location.pathname === "/myRecipe";

  const [allRecipes, setAllRecipes] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  const savedFavorites = useMemo(() => {
    const saved = localStorage.getItem("fav");
    return saved ? JSON.parse(saved) : [];
  }, []);

  useEffect(() => {
    setAllRecipes(recipes);
    const favoritesLookup = {};
    savedFavorites.forEach((item) => {
      favoritesLookup[item._id] = true;
    });
    setFavorites(favoritesLookup);
  }, [recipes, savedFavorites]);

  // Filter recipes based on search term
  const filteredRecipes = useMemo(() => {
    return allRecipes?.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allRecipes, searchTerm]);

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    try {
      await axios.delete(`https://recipeapp-vut0.onrender.com/recipe/${id}`);
      setAllRecipes((current) => current.filter((recipe) => recipe._id !== id));
      const updatedFavorites = savedFavorites.filter(
        (recipe) => recipe._id !== id
      );
      localStorage.setItem("fav", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  };

  const toggleFavorite = (item, event) => {
    event.stopPropagation();
    const isFavorite = favorites[item._id];
    const updatedFavorites = isFavorite
      ? savedFavorites.filter((recipe) => recipe._id !== item._id)
      : [...savedFavorites, item];
    localStorage.setItem("fav", JSON.stringify(updatedFavorites));
    setFavorites((current) => ({
      ...current,
      [item._id]: !isFavorite,
    }));
  };

  const handleImageError = (recipeId) => {
    setImageErrors((prev) => ({
      ...prev,
      [recipeId]: true,
    }));
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return "";
    // Make sure the URL is absolute and properly formatted
    return `https://recipeapp-vut0.onrender.com/images/${imageName}`;
  };

  return (
    <div className="contain">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            ×
          </button>
        )}
      </div>

      <div className="card-container">
        {filteredRecipes?.length === 0 ? (
          <div className="no-results">No recipes found</div>
        ) : (
          filteredRecipes?.map((recipe) => (
            <div
              key={recipe._id}
              className="card"
              onDoubleClick={() => navigate(`/recipe/${recipe._id}`)}>
              <div className="image-container">
                {!imageErrors[recipe._id] ? (
                  <img
                    src={getImageUrl(recipe.coverImage)}
                    alt={recipe.title}
                    onError={() => handleImageError(recipe._id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="image-fallback">
                    <span>{recipe.title[0]}</span>
                  </div>
                )}
              </div>
              <div className="card-body">
                <div className="title">{recipe.title}</div>
                <div className="icons">
                  <div className="timer">
                    <BsStopwatchFill />
                    {recipe.time}
                  </div>

                  {isMyRecipePage ? (
                    <div className="action">
                      <Link
                        to={`/editRecipe/${recipe._id}`}
                        className="editIcon">
                        <FaEdit />
                      </Link>
                      <MdDelete
                        onClick={(e) => handleDelete(recipe._id, e)}
                        className="deleteIcon"
                      />
                    </div>
                  ) : (
                    <FaHeart
                      onClick={(e) => toggleFavorite(recipe, e)}
                      style={{
                        color: favorites[recipe._id] ? "red" : "",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
