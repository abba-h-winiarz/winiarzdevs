import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <h1>Winiarz Recipes</h1>
      <NavLink to="/">Recipe List</NavLink> | {' '}
      <NavLink to="/addrecipe">Add a recipe</NavLink> | {' '}
      <a href="https://www.kosher.com/" target="_blank">Kosher.com</a> | {' '}
      <a href="https://www.tasteofhome.com/" target="_blank">Taste of Home</a>

      <hr />
    </header>
  )
}
