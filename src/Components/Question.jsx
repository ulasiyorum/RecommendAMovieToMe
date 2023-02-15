import './Question.css';
import { imagePath } from '../lib/private';
import { useState, useEffect } from 'react';
import { getGenres } from '../lib/movies';





function QuestionCard(props) {

    return (
    <div className='questionCard'>
        <img src={props.src} onClick={props.onClick}/>
        <h1>{props.title == undefined ? props.name : props.title}</h1>
        <div className='qc-stars'>
            <h5>Rating: </h5>
            <h5>{props.stars}</h5>
        </div>
    </div>
    
    );


}





export default function Question(props) {

    function getThreeMovies() {
        
        let tm = [];
        let random = Math.floor(Math.random() * 20);
        for(let i = 0; i < 3; i++) {
            while(tm.includes(movies[random]) || picked.includes(movies[random]))
            {
                random = Math.floor(Math.random() * movies.length);
            }
            tm.push(movies[random]);
        }
        return tm;



    }

    const [movies,setMovies] = useState(props.movies);
    const [reload, setReload] = useState(true);

    const [picked, setPicked] = useState([]);
    let tm = getThreeMovies();

    const pickOne = (e, item) => {
        
        picked.push(item);
        setReload(!reload);
    }
    const skipThis = (e) => {
        
        setReload(!reload);
    }

    return (
        picked.length == 5 ? (<Result picked={picked} movies={movies}/>) : (
        <div className='question'>
            <h1>Pick Your Favorite!</h1>
            <div>
                {tm.map((value) => {
                        return (
                            <QuestionCard src={imagePath + value.poster_path}
                            title={value.title}
                            name={value.name}  
                            key={value.id}
                            onClick={(event) => pickOne(event,value)}  
                            stars={value.vote_average/2}/>
                        );
                    
                    })
                }
                <QuestionCard
                title="None"
                stars="0"
                onClick={skipThis}
                />
            </div>
        </div>
        )

    );
}


function Result(props) {

    const [genre,setGenre] = useState({});

    useEffect(() => {
        const getGenre = async () => {

            const genres = await getGenres();
    
            setGenre(genres);
        }
        getGenre();
      }, []);
    

    const picked = props.picked;
    const all = props.movies;

    const genreIds = new Map();

    picked.forEach((movie) => {
        
        movie.genre_ids.forEach((id) => {

            if(!genreIds.has(id)) {

                genreIds.set(id,1);

            } else {

                const count = genreIds.get(id) + 1;
                genreIds.set(id,count);

            }

        });

    });

    const max = maxGenre(genreIds);
    return ( 
        genre.tv == undefined ? (<div>Waiting for results</div>) : (<div>{getGenreNamesWithId(max,genre.tv.genres,genre.movie.genres)}</div>)
    );
}


function getGenreNamesWithId(id,tvGenres,movieGenres) {
    console.log(id);
    let name = '';
    tvGenres.forEach((value) => {
        if(value.id == id)
            name = value.name;

    });
    if(name == '') {
        movieGenres.forEach((value) => {
            if(value.id == id)
                name = value.name;

        });
    }
    return name;
}


function maxGenre(set){

    let max = 0;
    let genre = 0;
    set.forEach((value,key) => {
        if(value > max) {
            max = value;
            genre = key;
        }
    });

    return genre;

}