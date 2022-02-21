import React from 'react';
import { NavLink } from 'react-router-dom';
//import { useState } from 'react';
import useFormLocalStorage from "./useFormLocalStorage";

export default function AddRecipeForm(props) {
    const [addRecipe, setRecipe] = useFormLocalStorage('addedRecipe',{id:'addedRecipe', name:'', ingredients:'', directions:'',tips:'' });
    const { name, ingredients,directions ,tips} = addRecipe;

    
    return (
        <>
            <h4>Add Recipe</h4>
            <form id="addRecipeForm">
                <div className="formGroup">
                    <label htmlFor="name">Recipe Name:</label>
                    <input id="name" value={name} onChange={setRecipe} name="name" required></input>
                </div>
                <div className="formGroup">
                    <label htmlFor="ingredients">Ingredients:</label>
                    <input id="ingredients" value={ingredients} onChange={setRecipe} name="ingredients" required></input>
                </div>
                <div className="formGroup">
                    <label htmlFor="directions">Directions:</label>
                    <input id="directions" value={directions} onChange={setRecipe} name="directions" required></input>
                </div>
                <div className="formGroup">
                    <label htmlFor="tips">Additional Tips:</label>
                    <input id="tips" value={tips} onChange={setRecipe} name="tips"></input>
                </div>
                <div className="buttons">
                    <NavLink to="/" className="btn btn-primary">Add Recipe</NavLink> | {''}
                    <button type="button" id="cancel" className="btn btn-primary" onClick={()=>{
                         localStorage.removeItem('addedRecipe'); 
                    }}>Reset</button>
                </div>
            </form>
        </>
    )
}
