import './Question.css';
const process = import.meta.env;
const imagePath = process.VITE_IMAGE_PATH;
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
        let random = Math.floor(Math.random() * movies.length);
        for(let i = 0; i < 4; i++) {
            while(tm.includes(movies[random]) || picked.includes(movies[random]) || ignoreList.includes(movies[random]))
            {
                random = Math.floor(Math.random() * movies.length);
            }
            tm.push(movies[random]);
        }
        return tm;



    }

    const [movies,setMovies] = useState(props.movies);
    const [reload, setReload] = useState(true);
    const [ignoreList, setIgnoreList] = useState([]);
    const [picked, setPicked] = useState([]);
    let tm = getThreeMovies();

    const pickOne = (e, item) => {
        
        picked.push(item);
        setReload(!reload);
    }
    const skipThis = (e,movs) => {
        ignoreList.push(movs[0]);
        ignoreList.push(movs[1]);
        ignoreList.push(movs[2]);
        ignoreList.push(movs[3]);
        setReload(!reload);
    }
    return (
        picked.length == 7 ? (<Result picked={picked} movies={movies} ignoreList={ignoreList}/>) : (
            ignoreList.length > 108 ? (<div>It seems like you don't want to watch a movie..</div>) : (
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
                onClick={(event) => skipThis(event, tm)}
                />
            </div>
        </div>
        ))

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

        let obj = {genres:genresList, adult:undefined, popularity: undefined, vote: undefined, howNew: undefined, langMatters: undefined, isAnime: undefined};
        let popularity = 0;
        let star = 0;
        let adult = 0;
        let date = 0;
        let langCount = 0;
        let animeCount = 0;

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

            if(value.original_language == 'ja')
                animeCount++;

        });

        obj.popularity = popularity / pickedMovies.length;
        obj.vote = star / pickedMovies.length;
        obj.adult = adult > 2;
        obj.howNew = date;
        obj.langMatters = langCount / picked.Length == 1;
        obj.isAnime = animeCount;
        return obj;

    }

    const specified = specify(max,picked);

    const findPerfectMovie = (specified) => {
        let perfects = [];
        let maxSimilarities = [];
        const movies = props.movies;
        let perfect = null;
        let maxSimilarity = 0;
        while(perfects.length < 3) {
            movies.forEach((movie) => {
                let si = findSimilarities(movie,specified);
                //console.log(si + " | " + movie.title);
                if(si > maxSimilarity && !picked.includes(movie) && !containsWithId(perfects,movie)) {
                    perfect = movie;
                    maxSimilarity = si;
                } else if(si == maxSimilarity && Math.floor(Math.random) * 2 == 1 && !picked.includes(movie) && !containsWithId(perfects,movie)) {
                    perfect = movie;
                }
            });
            perfects.push(perfect);
            maxSimilarities.push(maxSimilarity);
            maxSimilarity = 0;
            perfect = null;
        }


        return {perfects:perfects,similarities:maxSimilarities};
    
    }

    const containsWithId = (movieList,movie) => {

        let contains = false;
        movieList.forEach((value) => {
            if(value.id == movie.id)
                contains = true;
        });

        return contains;
    }

    const findSimilarities = (movie,specified) => {

        let similarity = 10;

        if(movie.genre_ids.includes(specified.genres[0]))
        {
            similarity += 55;
        } else {
            similarity -= 24;
        }

        if(movie.genre_ids.includes(specified.genres[1]))
        {
            similarity += 36;
        } else {
            similarity -= 12;
        }

        if(movie.genre_ids.includes(specified.genres[2]))
        {
            similarity += 19;
        } else {
            similarity -= 7;
        }

        if(movie.genre_ids.includes(specified.genres[3]))
        {
            similarity += 8;
        } else {
            similarity -= 3;
        }



        if(movie.adult == specified.adult) {
            similarity += 10;
        }

        let popularity = movie.popularity;
        while(!(popularity < specified.popularity + 24 || popularity > specified.popularity - 24)) {
            if(popularity < specified.popularity - 24) {
                popularity += 24;
                similarity -= 3.6;
            } else {
                popularity -= 24;
                similarity -= 3.6;
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
            
            if(dateOfMovie >= new Date().getFullYear() - 8) {
                similarity += 5;
            } else if(dateOfMovie >= new Date().getFullYear() - 16) {
                similarity += 7;
            } else {
                similarity += 4;
            }
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
            similarity -= 36;
        } else if(specified.langMatters && movie.original_language == 'ja' && specified.isAnime == 0) {
            similarity -= -50;
        } else if(!specified.langMatters && movie.original_language == 'ja' && specified.isAnime > 1) {
            similarity += (4 * specified.isAnime);
        } else {
            similarity += 12;
        }
        
        return similarity;
    }

    const perfectObj = findPerfectMovie(specified);
    const perfect = perfectObj.perfects;
    const sim = perfectObj.similarities;
    const [indexOfResultPage,setIndexOfResultPage] = useState(0);
    function getThreeMovieGenres(movie) {

        let genres = "";
    
        movie.genre_ids.forEach((value, index) => {
            if(index >= 3)
                return;
    
            genres += getGenreNamesWithId(value,genre.tv.genres,genre.movie.genres) + ", ";
        } );
    
        return genres.substring(0,genres.length-2);
    
    
    }
    const changePage = (event, page) => {
        setIndexOfResultPage(page);
    }

    // getGenreNamesWithId(max,genre.tv.genres,genre.movie.genres)
    return ( 
        genre.tv == undefined ? (<div>Waiting for results</div>) :
         (
         <div className='result'>
            <img src={imagePath + perfect[indexOfResultPage].poster_path} className='resultImage'></img>
            <div className='propertyContainer'>
            <h1 className='resultTitle'>{perfect[indexOfResultPage].title}</h1>
            <p className='paragraph'>{"Summary: " + perfect[indexOfResultPage].overview}</p>
            <div className='propertyContainerSecond'>
                <h3 className='resultProperty'>{"Genres: [" + getThreeMovieGenres(perfect[indexOfResultPage]) +"]"}</h3>
                <h3 className='resultProperty'>{"Vote Rating: " + perfect[indexOfResultPage].vote_average/2 + " ???"}</h3>
                <h3 className='resultProperty'>{"Release Date: " + dateRead(perfect[indexOfResultPage].release_date)}</h3>
                <h3 className='resultProperty'>{"Language: " + getLang(perfect[indexOfResultPage].original_language)}</h3>
                <h3 className='resultProperty'>{"Vote Count: " + perfect[indexOfResultPage].vote_count}</h3>
                <h3 className='resultProperty'>{"Popularity: " + getPopularity(perfect[indexOfResultPage].popularity)}</h3>
            </div>
                <h3 className='match'>{"Match: %" + getPercentage(sim[indexOfResultPage])}</h3>
            </div>
            {
                indexOfResultPage != 0 ? (
            <button className='next' onClick={(event) => changePage(event,(indexOfResultPage-1))}>Previous</button>
                ) : (<></>)
            }
            {
                indexOfResultPage + 1 != perfect.length ? (
                <button className='prev'onClick={(event) => changePage(event,(indexOfResultPage+1))}>Next</button>
                ) : (<></>)
            }
         </div>)
    );
}



function dateRead(date) {

    const arr = date.split('-');

    const month = arr[1] == 12 ? 'December' : arr[1] == 11 ? 'November' : arr[1] == 10 ? 'October' 
    : arr[1] == 9 ? 'September' : arr[1] == 8 ? 'August' : arr[1] == 7 ? 'July' : arr[1] == 6 ? 'June' : arr[1] == 5 ? 'May'
    : arr[1] == 4 ? 'April' : arr[1] == 3 ? 'March' : arr[1] == 2 ? 'February' : arr[1] == 1 ? 'January' : '';    

    return arr[2] + " " + month + " " + arr[0];
}

function getPopularity(popularity) {

    if(popularity > 75)
        return "Very Popular";

    if(popularity > 50)
        return "Popular";

    if(popularity > 40)
        return "Well-Known"

    if(popularity > 30)
        return "Known";

    if(popularity > 20)
        return "Normal";

    if(popularity > 0)
        return "Not Popular";


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

function getPercentage(points){

    return parseInt((points / 183 * 100).toString().substring(0,3));

}

function maxGenre(set){
    let genre = [];
    while(genre.length < 4) {
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

function getLang(code){


    var isoLangs = {
        "ab": {
            "name": "Abkhaz",
                "nativeName": "??????????"
        },
            "aa": {
            "name": "Afar",
                "nativeName": "Afaraf"
        },
            "af": {
            "name": "Afrikaans",
                "nativeName": "Afrikaans"
        },
            "ak": {
            "name": "Akan",
                "nativeName": "Akan"
        },
            "sq": {
            "name": "Albanian",
                "nativeName": "Shqip"
        },
            "am": {
            "name": "Amharic",
                "nativeName": "????????????"
        },
            "ar": {
            "name": "Arabic",
                "nativeName": "??????????????"
        },
            "an": {
            "name": "Aragonese",
                "nativeName": "Aragon??s"
        },
            "hy": {
            "name": "Armenian",
                "nativeName": "??????????????"
        },
            "as": {
            "name": "Assamese",
                "nativeName": "?????????????????????"
        },
            "av": {
            "name": "Avaric",
                "nativeName": "???????? ????????, ???????????????? ????????"
        },
            "ae": {
            "name": "Avestan",
                "nativeName": "avesta"
        },
            "ay": {
            "name": "Aymara",
                "nativeName": "aymar aru"
        },
            "az": {
            "name": "Azerbaijani",
                "nativeName": "az??rbaycan dili"
        },
            "bm": {
            "name": "Bambara",
                "nativeName": "bamanankan"
        },
            "ba": {
            "name": "Bashkir",
                "nativeName": "?????????????? ????????"
        },
            "eu": {
            "name": "Basque",
                "nativeName": "euskara, euskera"
        },
            "be": {
            "name": "Belarusian",
                "nativeName": "????????????????????"
        },
            "bn": {
            "name": "Bengali",
                "nativeName": "???????????????"
        },
            "bh": {
            "name": "Bihari",
                "nativeName": "?????????????????????"
        },
            "bi": {
            "name": "Bislama",
                "nativeName": "Bislama"
        },
            "bs": {
            "name": "Bosnian",
                "nativeName": "bosanski jezik"
        },
            "br": {
            "name": "Breton",
                "nativeName": "brezhoneg"
        },
            "bg": {
            "name": "Bulgarian",
                "nativeName": "?????????????????? ????????"
        },
            "my": {
            "name": "Burmese",
                "nativeName": "???????????????"
        },
            "ca": {
            "name": "Catalan; Valencian",
                "nativeName": "Catal??"
        },
            "ch": {
            "name": "Chamorro",
                "nativeName": "Chamoru"
        },
            "ce": {
            "name": "Chechen",
                "nativeName": "?????????????? ????????"
        },
            "ny": {
            "name": "Chichewa; Chewa; Nyanja",
                "nativeName": "chiChe??a, chinyanja"
        },
            "zh": {
            "name": "Chinese",
                "nativeName": "?????? (Zh??ngw??n), ??????, ??????"
        },
            "cv": {
            "name": "Chuvash",
                "nativeName": "?????????? ??????????"
        },
            "kw": {
            "name": "Cornish",
                "nativeName": "Kernewek"
        },
            "co": {
            "name": "Corsican",
                "nativeName": "corsu, lingua corsa"
        },
            "cr": {
            "name": "Cree",
                "nativeName": "?????????????????????"
        },
            "hr": {
            "name": "Croatian",
                "nativeName": "hrvatski"
        },
            "cs": {
            "name": "Czech",
                "nativeName": "??esky, ??e??tina"
        },
            "da": {
            "name": "Danish",
                "nativeName": "dansk"
        },
            "dv": {
            "name": "Divehi; Dhivehi; Maldivian;",
                "nativeName": "????????????"
        },
            "nl": {
            "name": "Dutch",
                "nativeName": "Nederlands, Vlaams"
        },
            "en": {
            "name": "English",
                "nativeName": "English"
        },
            "eo": {
            "name": "Esperanto",
                "nativeName": "Esperanto"
        },
            "et": {
            "name": "Estonian",
                "nativeName": "eesti, eesti keel"
        },
            "ee": {
            "name": "Ewe",
                "nativeName": "E??egbe"
        },
            "fo": {
            "name": "Faroese",
                "nativeName": "f??royskt"
        },
            "fj": {
            "name": "Fijian",
                "nativeName": "vosa Vakaviti"
        },
            "fi": {
            "name": "Finnish",
                "nativeName": "suomi, suomen kieli"
        },
            "fr": {
            "name": "French",
                "nativeName": "fran??ais, langue fran??aise"
        },
            "ff": {
            "name": "Fula; Fulah; Pulaar; Pular",
                "nativeName": "Fulfulde, Pulaar, Pular"
        },
            "gl": {
            "name": "Galician",
                "nativeName": "Galego"
        },
            "ka": {
            "name": "Georgian",
                "nativeName": "?????????????????????"
        },
            "de": {
            "name": "German",
                "nativeName": "Deutsch"
        },
            "el": {
            "name": "Greek, Modern",
                "nativeName": "????????????????"
        },
            "gn": {
            "name": "Guaran??",
                "nativeName": "Ava??e???"
        },
            "gu": {
            "name": "Gujarati",
                "nativeName": "?????????????????????"
        },
            "ht": {
            "name": "Haitian; Haitian Creole",
                "nativeName": "Krey??l ayisyen"
        },
            "ha": {
            "name": "Hausa",
                "nativeName": "Hausa, ????????????"
        },
            "he": {
            "name": "Hebrew (modern)",
                "nativeName": "??????????"
        },
            "hz": {
            "name": "Herero",
                "nativeName": "Otjiherero"
        },
            "hi": {
            "name": "Hindi",
                "nativeName": "??????????????????, ???????????????"
        },
            "ho": {
            "name": "Hiri Motu",
                "nativeName": "Hiri Motu"
        },
            "hu": {
            "name": "Hungarian",
                "nativeName": "Magyar"
        },
            "ia": {
            "name": "Interlingua",
                "nativeName": "Interlingua"
        },
            "id": {
            "name": "Indonesian",
                "nativeName": "Bahasa Indonesia"
        },
            "ie": {
            "name": "Interlingue",
                "nativeName": "Originally called Occidental; then Interlingue after WWII"
        },
            "ga": {
            "name": "Irish",
                "nativeName": "Gaeilge"
        },
            "ig": {
            "name": "Igbo",
                "nativeName": "As???s??? Igbo"
        },
            "ik": {
            "name": "Inupiaq",
                "nativeName": "I??upiaq, I??upiatun"
        },
            "io": {
            "name": "Ido",
                "nativeName": "Ido"
        },
            "is": {
            "name": "Icelandic",
                "nativeName": "??slenska"
        },
            "it": {
            "name": "Italian",
                "nativeName": "Italiano"
        },
            "iu": {
            "name": "Inuktitut",
                "nativeName": "??????????????????"
        },
            "ja": {
            "name": "Japanese",
                "nativeName": "????????? (??????????????????????????????)"
        },
            "jv": {
            "name": "Javanese",
                "nativeName": "basa Jawa"
        },
            "kl": {
            "name": "Kalaallisut, Greenlandic",
                "nativeName": "kalaallisut, kalaallit oqaasii"
        },
            "kn": {
            "name": "Kannada",
                "nativeName": "???????????????"
        },
            "kr": {
            "name": "Kanuri",
                "nativeName": "Kanuri"
        },
            "ks": {
            "name": "Kashmiri",
                "nativeName": "?????????????????????, ???????????????"
        },
            "kk": {
            "name": "Kazakh",
                "nativeName": "?????????? ????????"
        },
            "km": {
            "name": "Khmer",
                "nativeName": "???????????????????????????"
        },
            "ki": {
            "name": "Kikuyu, Gikuyu",
                "nativeName": "G??k??y??"
        },
            "rw": {
            "name": "Kinyarwanda",
                "nativeName": "Ikinyarwanda"
        },
            "ky": {
            "name": "Kirghiz, Kyrgyz",
                "nativeName": "???????????? ????????"
        },
            "kv": {
            "name": "Komi",
                "nativeName": "???????? ??????"
        },
            "kg": {
            "name": "Kongo",
                "nativeName": "KiKongo"
        },
            "ko": {
            "name": "Korean",
                "nativeName": "????????? (?????????), ????????? (?????????)"
        },
            "ku": {
            "name": "Kurdish",
                "nativeName": "Kurd??, ?????????????"
        },
            "kj": {
            "name": "Kwanyama, Kuanyama",
                "nativeName": "Kuanyama"
        },
            "la": {
            "name": "Latin",
                "nativeName": "latine, lingua latina"
        },
            "lb": {
            "name": "Luxembourgish, Letzeburgesch",
                "nativeName": "L??tzebuergesch"
        },
            "lg": {
            "name": "Luganda",
                "nativeName": "Luganda"
        },
            "li": {
            "name": "Limburgish, Limburgan, Limburger",
                "nativeName": "Limburgs"
        },
            "ln": {
            "name": "Lingala",
                "nativeName": "Ling??la"
        },
            "lo": {
            "name": "Lao",
                "nativeName": "?????????????????????"
        },
            "lt": {
            "name": "Lithuanian",
                "nativeName": "lietuvi?? kalba"
        },
            "lu": {
            "name": "Luba-Katanga",
                "nativeName": ""
        },
            "lv": {
            "name": "Latvian",
                "nativeName": "latvie??u valoda"
        },
            "gv": {
            "name": "Manx",
                "nativeName": "Gaelg, Gailck"
        },
            "mk": {
            "name": "Macedonian",
                "nativeName": "???????????????????? ??????????"
        },
            "mg": {
            "name": "Malagasy",
                "nativeName": "Malagasy fiteny"
        },
            "ms": {
            "name": "Malay",
                "nativeName": "bahasa Melayu, ???????? ?????????????"
        },
            "ml": {
            "name": "Malayalam",
                "nativeName": "??????????????????"
        },
            "mt": {
            "name": "Maltese",
                "nativeName": "Malti"
        },
            "mi": {
            "name": "M??ori",
                "nativeName": "te reo M??ori"
        },
            "mr": {
            "name": "Marathi (Mar?????h??)",
                "nativeName": "???????????????"
        },
            "mh": {
            "name": "Marshallese",
                "nativeName": "Kajin M??aje??"
        },
            "mn": {
            "name": "Mongolian",
                "nativeName": "????????????"
        },
            "na": {
            "name": "Nauru",
                "nativeName": "Ekakair?? Naoero"
        },
            "nv": {
            "name": "Navajo, Navaho",
                "nativeName": "Din?? bizaad, Din??k??eh????"
        },
            "nb": {
            "name": "Norwegian Bokm??l",
                "nativeName": "Norsk bokm??l"
        },
            "nd": {
            "name": "North Ndebele",
                "nativeName": "isiNdebele"
        },
            "ne": {
            "name": "Nepali",
                "nativeName": "??????????????????"
        },
            "ng": {
            "name": "Ndonga",
                "nativeName": "Owambo"
        },
            "nn": {
            "name": "Norwegian Nynorsk",
                "nativeName": "Norsk nynorsk"
        },
            "no": {
            "name": "Norwegian",
                "nativeName": "Norsk"
        },
            "ii": {
            "name": "Nuosu",
                "nativeName": "????????? Nuosuhxop"
        },
            "nr": {
            "name": "South Ndebele",
                "nativeName": "isiNdebele"
        },
            "oc": {
            "name": "Occitan",
                "nativeName": "Occitan"
        },
            "oj": {
            "name": "Ojibwe, Ojibwa",
                "nativeName": "????????????????????????"
        },
            "cu": {
            "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
                "nativeName": "?????????? ????????????????????"
        },
            "om": {
            "name": "Oromo",
                "nativeName": "Afaan Oromoo"
        },
            "or": {
            "name": "Oriya",
                "nativeName": "???????????????"
        },
            "os": {
            "name": "Ossetian, Ossetic",
                "nativeName": "???????? ??????????"
        },
            "pa": {
            "name": "Panjabi, Punjabi",
                "nativeName": "??????????????????, ???????????????"
        },
            "pi": {
            "name": "P??li",
                "nativeName": "????????????"
        },
            "fa": {
            "name": "Persian",
                "nativeName": "??????????"
        },
            "pl": {
            "name": "Polish",
                "nativeName": "polski"
        },
            "ps": {
            "name": "Pashto, Pushto",
                "nativeName": "????????"
        },
            "pt": {
            "name": "Portuguese",
                "nativeName": "Portugu??s"
        },
            "qu": {
            "name": "Quechua",
                "nativeName": "Runa Simi, Kichwa"
        },
            "rm": {
            "name": "Romansh",
                "nativeName": "rumantsch grischun"
        },
            "rn": {
            "name": "Kirundi",
                "nativeName": "kiRundi"
        },
            "ro": {
            "name": "Romanian, Moldavian, Moldovan",
                "nativeName": "rom??n??"
        },
            "ru": {
            "name": "Russian",
                "nativeName": "?????????????? ????????"
        },
            "sa": {
            "name": "Sanskrit (Sa???sk???ta)",
                "nativeName": "???????????????????????????"
        },
            "sc": {
            "name": "Sardinian",
                "nativeName": "sardu"
        },
            "sd": {
            "name": "Sindhi",
                "nativeName": "??????????????????, ?????????? ?????????????"
        },
            "se": {
            "name": "Northern Sami",
                "nativeName": "Davvis??megiella"
        },
            "sm": {
            "name": "Samoan",
                "nativeName": "gagana faa Samoa"
        },
            "sg": {
            "name": "Sango",
                "nativeName": "y??ng?? t?? s??ng??"
        },
            "sr": {
            "name": "Serbian",
                "nativeName": "???????????? ??????????"
        },
            "gd": {
            "name": "Scottish Gaelic; Gaelic",
                "nativeName": "G??idhlig"
        },
            "sn": {
            "name": "Shona",
                "nativeName": "chiShona"
        },
            "si": {
            "name": "Sinhala, Sinhalese",
                "nativeName": "???????????????"
        },
            "sk": {
            "name": "Slovak",
                "nativeName": "sloven??ina"
        },
            "sl": {
            "name": "Slovene",
                "nativeName": "sloven????ina"
        },
            "so": {
            "name": "Somali",
                "nativeName": "Soomaaliga, af Soomaali"
        },
            "st": {
            "name": "Southern Sotho",
                "nativeName": "Sesotho"
        },
            "es": {
            "name": "Spanish; Castilian",
                "nativeName": "espa??ol, castellano"
        },
            "su": {
            "name": "Sundanese",
                "nativeName": "Basa Sunda"
        },
            "sw": {
            "name": "Swahili",
                "nativeName": "Kiswahili"
        },
            "ss": {
            "name": "Swati",
                "nativeName": "SiSwati"
        },
            "sv": {
            "name": "Swedish",
                "nativeName": "svenska"
        },
            "ta": {
            "name": "Tamil",
                "nativeName": "???????????????"
        },
            "te": {
            "name": "Telugu",
                "nativeName": "??????????????????"
        },
            "tg": {
            "name": "Tajik",
                "nativeName": "????????????, to??ik??, ???????????????"
        },
            "th": {
            "name": "Thai",
                "nativeName": "?????????"
        },
            "ti": {
            "name": "Tigrinya",
                "nativeName": "????????????"
        },
            "bo": {
            "name": "Tibetan Standard, Tibetan, Central",
                "nativeName": "?????????????????????"
        },
            "tk": {
            "name": "Turkmen",
                "nativeName": "T??rkmen, ??????????????"
        },
            "tl": {
            "name": "Tagalog",
                "nativeName": "Wikang Tagalog, ??????????????? ??????????????????"
        },
            "tn": {
            "name": "Tswana",
                "nativeName": "Setswana"
        },
            "to": {
            "name": "Tonga (Tonga Islands)",
                "nativeName": "faka Tonga"
        },
            "tr": {
            "name": "Turkish",
                "nativeName": "T??rk??e"
        },
            "ts": {
            "name": "Tsonga",
                "nativeName": "Xitsonga"
        },
            "tt": {
            "name": "Tatar",
                "nativeName": "??????????????, tatar??a, ?????????????????"
        },
            "tw": {
            "name": "Twi",
                "nativeName": "Twi"
        },
            "ty": {
            "name": "Tahitian",
                "nativeName": "Reo Tahiti"
        },
            "ug": {
            "name": "Uighur, Uyghur",
                "nativeName": "Uy??urq??, ???????????????????"
        },
            "uk": {
            "name": "Ukrainian",
                "nativeName": "????????????????????"
        },
            "ur": {
            "name": "Urdu",
                "nativeName": "????????"
        },
            "uz": {
            "name": "Uzbek",
                "nativeName": "zbek, ??????????, ???????????????"
        },
            "ve": {
            "name": "Venda",
                "nativeName": "Tshiven???a"
        },
            "vi": {
            "name": "Vietnamese",
                "nativeName": "Ti???ng Vi???t"
        },
            "vo": {
            "name": "Volap??k",
                "nativeName": "Volap??k"
        },
            "wa": {
            "name": "Walloon",
                "nativeName": "Walon"
        },
            "cy": {
            "name": "Welsh",
                "nativeName": "Cymraeg"
        },
            "wo": {
            "name": "Wolof",
                "nativeName": "Wollof"
        },
            "fy": {
            "name": "Western Frisian",
                "nativeName": "Frysk"
        },
            "xh": {
            "name": "Xhosa",
                "nativeName": "isiXhosa"
        },
            "yi": {
            "name": "Yiddish",
                "nativeName": "????????????"
        },
            "yo": {
            "name": "Yoruba",
                "nativeName": "Yor??b??"
        },
            "za": {
            "name": "Zhuang, Chuang",
                "nativeName": "Sa?? cue????, Saw cuengh"
        }
    }
    var arr = [];
    for (i in isoLangs) {
        arr.push([i, isoLangs[i]]);
    }
    
    var language;
    for (var i = 0; i < arr.length; i++) {
        if (code == arr[i][0]) {
    
            language = arr[i][1]['name'];
        }
    }

    return language;
}