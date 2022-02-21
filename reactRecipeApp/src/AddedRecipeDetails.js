import React from 'react';
import { useState, useEffect } from 'react';



export default function RecipeDetails() {
  const [recipe, setRecipe] = useState();
  

  useEffect(() => {
    (async () => {

      if (localStorage.addedRecipe) {
        setRecipe(JSON.parse(localStorage.addedRecipe));
      }
    })();
  }, []);

  if (!recipe) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h2>{recipe.name}</h2>
      <h4>Ingredients</h4>
      <ul className="bulletless">
        <li key={ "ingredients"}>{recipe.ingredients}</li>
      </ul>
      <h4>Directions</h4>
      <ul className="bulletless">
        <li key={"directions"}>{recipe.directions}</li>
      </ul>
    </>
  );
}
