import './Question.css';
import { imagePath } from '../lib/private';
import { useState, useEffect, useDebugValue } from 'react';
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
        let random = Math.floor(Math.random() * movies.length);
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
                            stars={(value.vote_average/2).toString().substring(0,3)}/>
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

    const specify = (genresList,pickedMovies) => {

        let obj = {genres:genresList, adult:undefined, popularity: undefined, vote: undefined, howNew: undefined, langMatters: undefined};
        let popularity = 0;
        let star = 0;
        let adult = 0;
        let date = 0;
        let langCount = 0;

        pickedMovies.forEach((value) => {
            if(value.adult) {
                adult++;
            }
            popularity += value.popularity;
            star += value.vote_average;
            if(value.media_type == 'tv') {

                let d = parseInt(value.first_air_date.substring(0,4));

                if(d > new Date().getFullYear() - 12)
                    date++;
                else if(d > new Date().getFullYear() - 18)
                {
                    
                }
                else {
                    date--;
                }
            }
            else {
                let d = parseInt(value.release_date.substring(0,4));

                if(d > new Date().getFullYear() - 10)
                    date++;
                else if(d > new Date().getFullYear() - 16)
                {

                }
                else {
                    date--;
                }
            }

            if(value.original_language == 'en')
                langCount++;

        });

        obj.popularity = popularity / pickedMovies.length;
        obj.vote = star / pickedMovies.length;
        obj.adult = adult > 2;
        obj.howNew = date;
        obj.langMatters = langCount / picked.Length == 1;

        return obj;

    }

    const specified = specify(max,picked);

    const findPerfectMovie = (specified) => {

        const movies = props.movies;
        let perfect = null;
        let maxSimilarity = 0;
        movies.forEach((movie) => {
            let si = findSimilarities(movie,specified);
            if(si > maxSimilarity) {
                perfect = movie;
                maxSimilarity = si;
            }
        });
    
    
        return perfect;
    
    }


    const findSimilarities = (movie,specified) => {

        let similarity = 10;

        if(movie.genre_ids.includes(specified.genres[0]))
        {
            similarity += 50;
        } else {
            similarity -= 20;
        }

        if(movie.genre_ids.includes(specified.genres[1]))
        {
            similarity += 20;
        } else {
            similarity -= 5;
        }

        if(movie.genre_ids.includes(specified.genres[2]))
        {
            similarity += 5;
        } else {
            similarity -= 1;
        }

        if(movie.adult == specified.adult) {
            similarity += 10;
        }

        let popularity = movie.popularity;
        while(!(popularity < specified.popularity + 100 || popularity > specified.popularity - 100)) {
            if(popularity < specified.popularity - 100) {
                popularity += 100;
                similarity -= 4;
            } else {
                popularity -= 100;
                similarity -= 4;
            }
        }
        let vote = movie.vote_average;
        while(!(vote <= specified.vote + 1 || vote >= specified.vote - 1)) {
            if(vote > specified.vote + 1) {
                vote--;
                similarity -= 4;
            } else {
                vote++;
                similarity -= 4;
            }
        }

        similarity += 20;

        let dateOfMovie = 0;
        if(movie.media_type == 'tv') {

            dateOfMovie = parseInt(movie.first_air_date.substring(0,4));
        } else {
            dateOfMovie = parseInt(movie.release_date.substring(0,4));
        }

        if(specified.howNew > 3) {
                
            if(dateOfMovie <= new Date().getFullYear() - 4) {
                similarity -= 20;
            } else {
                similarity += 20;
            }
        }
        else if(specified.howNew > 1) {

            if(dateOfMovie <= new Date().getFullYear() - 11) {
                similarity -= 10;
            } else {
                similarity += 10;
            }
        }
        else if(specified.howNew == 0) {
            similarity += 5;
        } else if(specified.howNew > -3) {
            if(dateOfMovie >= new Date().getFullYear() - 12) {
                similarity -= 10;
            } else if(dateOfMovie >= new Date().getFullYear() - 16) {
                similarity += 10;
            } else {
                similarity += 5;
            }
        } else {
            if(dateOfMovie >= new Date().getFullYear() - 12) {
                similarity -= 20;
            } else if(dateOfMovie >= new Date().getFullYear() - 16) {
                similarity += 5;
            } else {
                similarity += 25;
            }
        }

        if(specified.langMatters && movie.original_language != 'en')
        {    
            similarity -= 25;
        }
        
        return similarity;
    }

    const perfect = findPerfectMovie(specified);
    // getGenreNamesWithId(max,genre.tv.genres,genre.movie.genres)
    return ( 
        genre.tv == undefined ? (<div>Waiting for results</div>) :
         (
         <div className='questionCard'>
            <img src={imagePath + perfect.poster_path}></img>
            <h1>{perfect.title}</h1>
         </div>)
    );
}


function getGenreNamesWithId(id,tvGenres,movieGenres) {
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
    let genre = [];
    while(genre.length < 3) {
        let max = 0;
        let selected = 0;
        set.forEach((value,key) => {
            if(value > max && !genre.includes(key)) {
                max = value;
                selected = key;
            }
        });
        genre.push(selected);
    }
    return genre;

}