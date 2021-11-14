
document.addEventListener("DOMContentLoaded", addMovieForm);

function addMovieForm(){
    const form = document.getElementById("movie-form");
    form.addEventListener("submit",saveMovie);
}

async function saveMovie(event){
    event.preventDefault();

    const form = event.currentTarget;
    const url = form.action;

    try{
        const formData = new FormData(form);
        await saveMovieToDb(url,formData);
    }catch(er) {
        console.log("Failed To Save To DB: "+er);
    }
    window.location.href = "Movie.html";
}

async function saveMovieToDb(url,formData){
    const plainData = Object.fromEntries(formData.entries());

    const movieJSON = {
        movie_name : plainData.movie_name,
        description : plainData.description,
        actors : plainData.actors,
        duration : plainData.duration,
        imgUrl : plainData.imgUrl,
        year:plainData.year,
        activity: "active"
    }
    const JSONObjectToJSONString = JSON.stringify(movieJSON);
    const POSTOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSONObjectToJSONString
    }
    const response = await fetch(url,POSTOptions);
    return response.json();
}

