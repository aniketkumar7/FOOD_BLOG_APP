import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import RecipeItems from "./components/RecipeItems";

const getAllRecipes = async () => {
  let allRecipes = [];
  await axios.get("https://food-blog-app.onrender.com/recipe").then((res) => {
    allRecipes = res.data;
  });
  return allRecipes;
};

const getMyRecipes = async () => {
  let user = JSON.parse(localStorage.getItem("user"));
  let allRecipes = await getAllRecipes();
  return allRecipes.filter((item) => item.createdBy === user._id);
};

const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav"));
};

const getRecipe = async ({ params }) => {
  let recipe;
  await axios
    .get(`https://food-blog-app.onrender.com/recipe/${params.id}`)
    .then((res) => (recipe = res.data));

  await axios
    .get(`https://food-blog-app.onrender.com/user/${recipe.createdBy}`)
    .then((res) => {
      recipe = { ...recipe, email: res.data.email };
    });

  return recipe;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <RecipeItems />, loader: getMyRecipes },
      { path: "/favRecipe", element: <RecipeItems />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe },
    ],
  },
]);


export default function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}
