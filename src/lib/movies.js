import { movieApi } from "./private";

const requestLink = "https://api.themoviedb.org/3/trending/all/day?api_key=" + movieApi;

const requestLink2 = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + movieApi + "&language=en-US&page=";

const movieGenresLink = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + movieApi + "&language=en-US"

const tvGenresLink = "https://api.themoviedb.org/3/genre/tv/list?api_key=" + movieApi + "&language=en-US"

export default async function getMovies(){

    const response = await fetch(requestLink).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(error);
    });

    const getTopRated = async (page) => {

        const requestLinks = requestLink2 + page;

        const response2 = await fetch(requestLinks).then((response) => {
            return response.json();
    
        }).catch((error) => {
            console.log(error);
        });
    
        response2.results.forEach(element => {
            if(!response.results.includes(element))
                response.results.push(element);
        });

    }

        
    await getTopRated('1');
    await getTopRated('2');
    await getTopRated('3');
    await getTopRated('4');
    await getTopRated('5');
    await getTopRated('6');
    
    return response.results;


}

export async function getGenres() {

    const movieResponse = await fetch(movieGenresLink).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(error);
    });

    const tvResponse = await fetch(tvGenresLink).then((response) => {
        return response.json();

    }).catch((error) => {
        console.log(error);
    });

    return {movie:movieResponse, tv:tvResponse};
}