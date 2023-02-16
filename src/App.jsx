import { useState, useEffect } from 'react'
import './App.css'
import Question from './Components/Question'
import getMovies from './lib/movies'

function App() {

  const [movies,setMovies] = useState([]);
  useEffect(() => {

    const getMovieList = async() => {
      const m = await getMovies();
      setMovies(m);
    }
    getMovieList();
  }, []);

  
  return (
    
    movies.length == 0 ? 
    (<div>Waiting for movies</div>) : (
    <Question movies={movies}/>)
    
  );


}

export default App
