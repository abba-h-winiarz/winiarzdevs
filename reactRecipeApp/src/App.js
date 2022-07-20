import './App.css';
import React, { Component } from 'react';
import RecipeDetails from './RecipeDetails';
import AddedRecipeDetails from './AddedRecipeDetails';
import RecipeList from './RecipeList';
import AddRecipeForm from './AddRecipeForm';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Header from './Header';

export default class App extends Component {


  render() {
    return (
      <div className='container-fluid'>
        <div className='text-center'>
          <Header />
          <Routes>
            <Route index element={<RecipeList />} />
            <Route path='/:id' element={<RecipeDetails />} />
            <Route path='/addedRecipe' element={<AddedRecipeDetails />} />
            <Route path='/addrecipe' element={<AddRecipeForm />} />
            <Route path='*' element={<Navigate to='/' replace="true" />} />
          </Routes>
          <Outlet />
          <hr />
        </div>
      </div>
    );
  }
}