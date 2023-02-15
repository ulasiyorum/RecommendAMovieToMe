import { useState } from 'react'
import './App.css'
import Question from './Components/Question'
import movies from './lib/movies'

function App() {

  const movieList = movies();

  return (
    <Question/>
  )
}

export default App
