import { useState, useEffect } from 'react'
import './App.css'
import Question from './Components/Question'
import getMovies from './lib/movies'
import intro, { durs } from './lib/animation';

function App() {
  const [anim,setAnim] = useState(true);
  const [movies,setMovies] = useState([]);
  useEffect(() => {

    const getMovieList = async() => {
      const m = await getMovies();
      setMovies(m);
    }
    getMovieList();
  }, []);

  const skip = (event) => {

    setAnim(false);
  }

  intro();
  if(durs != 0) {
    setTimeout(() => {
      setAnim(false);
    }, durs);
  }

  return ( movies.length == 0 ? (<div>Waiting for movies..</div>) : anim ? (
    <div id="parent">
    <h1 className='intro'>Let's start!</h1>
    <h1 className='intro'>We will ask you your favorite movies to recommend you a movie to watch tonight!</h1>
    <h1 className='intro'>Welcome to Movie Finder!</h1>
    <button className='skip' onClick={skip}>Skip</button>
    </div> ) : (<Question movies={movies}/>)
  );


}

export default App
