import { movieApi } from "./private";

const requestLink = "https://api.themoviedb.org/3/trending/all/day?api_key=" + movieApi;

const movieGenresLink = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + movieApi + "&language=en-US"

const tvGenresLink = "https://api.themoviedb.org/3/genre/tv/list?api_key=" + movieApi + "&language=en-US"

export default async function getMovies(){

    const response = await fetch(requestLink).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(error);
    });
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