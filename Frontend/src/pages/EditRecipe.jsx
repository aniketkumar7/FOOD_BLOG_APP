import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`https://recipeapp-vut0.onrender.com/recipe/${id}`)
        .then((response) => {
          let res = response.data;
          setRecipeData({
            title: res.title,
            ingredients: res.ingredients.join(","),
            instructions: res.instructions,
            time: res.time,
          });
        });
    };
    getData();
  },[]);

  const onHandleChange = (e) => {
    let val =
      e.target.name === "ingredients"
        ? e.target.value.split(",")
        : e.target.name === "file"
        ? e.target.files[0]
        : e.target.value;
    setRecipeData((pre) => ({ ...pre, [e.target.name]: val }));
  };
  const onHandleSubmit = async (e) => {
    e.preventDefault();
    console.log(recipeData);
    await axios
      .put(`https://recipeapp-vut0.onrender.com/recipe/${id}`, recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => navigate("/myRecipe"));
  };
  return (
    <>
      <div className="edit-recipe-container">
        <form className="edit-recipe-form" onSubmit={onHandleSubmit}>
          <div className="edit-recipe-form-control">
            <label>Title</label>
            <input
              type="text"
              className="edit-recipe-input"
              name="title"
              onChange={onHandleChange}
              value={recipeData.title}
            />
          </div>
          <div className="edit-recipe-form-control">
            <label>Time</label>
            <input
              type="text"
              className="edit-recipe-input"
              name="time"
              onChange={onHandleChange}
              value={recipeData.time}
            />
          </div>
          <div className="edit-recipe-form-control">
            <label>Ingredients</label>
            <textarea
              className="edit-recipe-textarea"
              name="ingredients"
              rows="5"
              onChange={onHandleChange}
              value={recipeData.ingredients}
            />
          </div>
          <div className="edit-recipe-form-control">
            <label>Instructions</label>
            <textarea
              className="edit-recipe-textarea"
              name="instructions"
              rows="5"
              onChange={onHandleChange}
              value={recipeData.instructions}
            />
          </div>
          <div className="edit-recipe-form-control">
            <label>Recipe Image</label>
            <input
              type="file"
              className="edit-recipe-file-input"
              name="file"
              onChange={onHandleChange}
            />
          </div>
          <button type="submit" className="edit-recipe-submit">
            Edit Recipe
          </button>
        </form>
      </div>
    </>
  );
}
