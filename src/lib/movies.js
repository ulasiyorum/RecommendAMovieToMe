import { movieApi } from "./private";

const requestLink = "https://api.themoviedb.org/3/trending/all/day?api_key=" + movieApi;

export default async function getMovies(){

    const response = await fetch(requestLink).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(error);
    });
    return response.results;


}