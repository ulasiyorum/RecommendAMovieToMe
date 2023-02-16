import { movieApi } from "./private";

const requestLink = "https://api.themoviedb.org/3/trending/all/day?api_key=" + movieApi;

const requestLink2 = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + movieApi + "&language=en-US&page=1";

const requestLink3 = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + movieApi + "&language=en-US&page=2";

const requestLink4 = "https://api.themoviedb.org/3/movie/top_rated?api_key=" + movieApi + "&language=en-US&page=3";

const movieGenresLink = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + movieApi + "&language=en-US"

const tvGenresLink = "https://api.themoviedb.org/3/genre/tv/list?api_key=" + movieApi + "&language=en-US"

export default async function getMovies(){

    const response = await fetch(requestLink).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(error);
    });

    const response2 = await fetch(requestLink2).then((response) => {
        return response.json();

    }).catch((error) => {
        console.log(error);
    });

    response2.results.forEach(element => {
        if(!response.results.includes(element))
            response.results.push(element);
    });
    const response3 = await fetch(requestLink3).then((response) => {
        return response.json();

    }).catch((error) => {
        console.log(error);
    });

    response3.results.forEach(element => {
        if(!response.results.includes(element))
            response.results.push(element);
    });
    const response4 = await fetch(requestLink4).then((response) => {
        return response.json();

    }).catch((error) => {
        console.log(error);
    });

    response4.results.forEach(element => {
        if(!response.results.includes(element))
            response.results.push(element);
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