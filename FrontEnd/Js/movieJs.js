
const movieFetchUrl = "http://localhost:8080/movies";

let movieList = [];
let screeningList = [];
let inactiveMovieList = [];

async function fetchMovies(){
    movieList = [];
    inactiveMovieList = [];

    const promise = fetch(movieFetchUrl).then(response => response.json());
    await promise.then(data => {
        data.forEach(movie =>{
            if(movie.activity === "inactive"){
                inactiveMovieList.push(movie);
            }else {
                movieList.push(movie);
            }
        })
    })
        setMovies(movieList);
}

(async function(){
    await fetchMovies();
    await fetchScreening();
}())

async function fetchScreening(){
    const url = "http://localhost:8080/screenings";

    try{
        const promise = fetch(url).then(response => response.json());
        await promise.then(data => {
            data.forEach(screening => {
                screeningList.push(screening);
            })
        })
    }
    catch(error){
        console.warn("Failed To Fetch Screenings: "+error);
    }

    //Removing Screening that has passed current day from list
    let index = 0;
    screeningList.forEach(screening => {
        const screenDate = new Date(screening.date);
        const today = new Date();

        if(screenDate.getFullYear() === today.getFullYear()) {
            if (screenDate.getDate() < today.getDate()) {

                //all the screening that has pased current date will be put in expiredList
                screeningList.splice(index,1);
            }
        }
        index++;
    });
}
function clearMovieShow(){
    const parentDiv = document.getElementById("movie-show");

    while(parentDiv.hasChildNodes()){
        parentDiv.firstChild.remove();
    }

}

function setMovies(list){


        list.forEach(movie => {
            const outerDiv = document.getElementById("movie-show");
            const containerDiv = document.createElement("div");
            const deleteHead = document.createElement("div");
            deleteHead.className = "delete-movie";

            const deleteBtn = document.createElement("a");
            deleteBtn.id = "deleteBtnMovie";
            deleteHead.appendChild(deleteBtn);

            /*
            * Before deleting a movie, the method traverses screening to check if there is a match
            * only if there is none, will the movie be deleted
            * */
            deleteBtn.addEventListener("click", async() => {
            let matchFlag = false;
                screeningList.forEach(screening =>{
                    if(screening.movie_id === movie.movie_id){
                        alert("Cannot Delete Movie Assigned To Screening: "+screening.screening_id);
                        matchFlag = true;
                    }
                })
                if(!matchFlag){
                    await deleteMovie(movie.movie_id);
                    clearMovieShow();
                        if(document.getElementById("showInactiveMovies").innerHTML === "Inactive Movies") {
                            setMovies(movieList);
                        }else{
                            setMovies(inactiveMovieList);
                        }
                }
            });

            containerDiv.id = movie.movie_id;
            containerDiv.className = "movie-container";
            containerDiv.appendChild(deleteHead);



            const innerDiv = document.createElement("div");
            const divImg = document.createElement("img");
            innerDiv.className = "image";
            divImg.src = movie.imgUrl;


            innerDiv.append(divImg);
            innerDiv.addEventListener( "click", () => {
                window.location.href = "editMovie.html?id=" + containerDiv.id;
            });

            const secInnerDiv = document.createElement("div");
            secInnerDiv.className = "info";
            let tempP = document.createElement("p");
            tempP.innerHTML = movie.movie_name;
            secInnerDiv.appendChild(tempP);
            containerDiv.append(innerDiv);
            containerDiv.append(secInnerDiv);

            outerDiv.append(containerDiv);
        })


        if(document.getElementById("showInactiveMovies").innerHTML === "Inactive Movies"){
            document.getElementById("title").innerHTML = "Active Movies ("+list.length+")";
        }
        else {
            document.getElementById("title").innerHTML = "Inactive Movies ("+list.length+")";
        }
}
async function deleteMovie(movie_id){
    const url = "http://localhost:8080/deleteMovie/"+movie_id;
    try{
        await fetch(url);
        await fetchMovies();
    }
    catch(error){
        console.warn("Failed to Delete Movie: "+error);
    }
}

const inactiveMovie = document.getElementById("showInactiveMovies");
inactiveMovie.addEventListener("click",() => {
    clearMovieShow();

    if(inactiveMovie.innerHTML === "Inactive Movies") {
        document.getElementById("title").innerHTML = "Inactive Movies";
        inactiveMovie.innerHTML = "Active Movies";
        setMovies(inactiveMovieList);
    }else{
        inactiveMovie.innerHTML = "Inactive Movies";
        document.getElementById("title").innerHTML = "Active Movies";
        setMovies(movieList);
    }
});






