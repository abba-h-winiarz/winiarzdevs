import React from 'react';
import ListComponent from './ListComponent';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


export default function RecipeDetails() {
  const [recipe, setRecipe] = useState();
  const { id } = useParams();

  useEffect(() => {
    (async () => {

      if (localStorage.addedRecipe &&id==="addedRecipe") {
        setRecipe(JSON.parse(localStorage.addedRecipe));
      } else {
        try {
          let r = await fetch(`/data/${id}.json`);
          if (!r.ok) {
            throw new Error(`${r.status} ${r.statusText}`);
          }
          const recipe = await r.json();
          setRecipe(recipe);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const { name, ingredients, directions } = recipe;
  return (
    <>
      <h2>{name}</h2>
      <ListComponent title="Ingredients" items={ingredients} />
      <ListComponent title="Directions" items={directions} />
    </>
  );
}
