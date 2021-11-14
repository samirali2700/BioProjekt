

addEventListener("DOMContentLoaded",addScreeningForm);
let selectedMovie;
let movieList = [];


async function addScreeningForm(){
    const form = document.getElementById("screening-form");
    form.addEventListener("submit", submitForm);
    await fetchMovies();
    createDropdown();
}
async function fetchMovies(){
    const movieUrl = "http://localhost:8080/movies";
    const promise = fetch(movieUrl).then(response => response.json());
    await promise.then(data => {
        data.forEach(movie => {
            if(movie.activity === "active") {
                movieList.push(movie);
            }
        });
    });
}
function createDropdown(){

    const dropdownField = document.getElementById("movieDropDown");

    movieList.forEach(movie => {
        const options = document.createElement("option");
        options.textContent = movie.movie_name;
        options.value = movie.movie_id;
        dropdownField.append(options);
    });
    movieList.forEach(movie => {
        if(parseInt(dropdownField.value) === movie.movie_id){
            selectedMovie = movie;
        }
    });
    dropdownField.addEventListener("change", (event) => {
        const optionIndex = dropdownField.value;
        movieList.forEach(movie => {
            if(parseInt(optionIndex) === movie.movie_id){
                selectedMovie = movie;
            }
        });
    });
}
async function submitForm(event){

    event.preventDefault();

    const form = event.currentTarget;
    const url = form.action;
    try{
        const formData = new FormData(form);
        await saveScreeningToDb(url,formData);
        await saveHistory("http://localhost:8080/saveHistory", formData);
    }catch (er){
        console.log("Failed To Save Screening To Db:"+er);
    }

    window.location.href = "Screening.html";

}
async function saveHistory(url,formData){

    const historyJSON = {
        movie_id: selectedMovie.movie_id,
        screening_time: 1,
        total_sales: 0
    }
    const JSONObjectToJSONStringH = JSON.stringify(historyJSON);
    const POSTOptionsH = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSONObjectToJSONStringH
    }
    await  fetch("http://localhost:8080/saveHistory",POSTOptionsH);

}
async function saveScreeningToDb(url,formData){
    const plainData = Object.fromEntries(formData.entries());

    let endTime = plainData.startTime.split(":");
    let tempDuration = selectedMovie.duration;
    let midNightFlag;
    do{
        if(endTime[1] === 60){
            endTime[1] = 0;

            if(parseInt(endTime[0]) === 23) {
                endTime[0] = 0;
                midNightFlag = true;
            }
            else{
                endTime[0]++;
            }
        }
        else{
            endTime[1]++;
            tempDuration--;
        }
    }while(tempDuration !== 0)

    if(midNightFlag){
        endTime[0] = "0"+endTime[0];
    }

    let end_time = endTime[0]+":"+endTime[1];

    const screeningJSON = {
        movie_id: selectedMovie.movie_id,
        screening_room : plainData.room,
        seats : plainData.seats,
        seats_available : plainData.seats,
        date: plainData.date,
        start_time: plainData.startTime,
        end_time: end_time,
        sales: 0
    }

    const JSONObjectToJSONString = JSON.stringify(screeningJSON);
    const POSTOptions = {
        method:"POST",
        headers:{
            "Content-type": "application/json"
        },
        body: JSONObjectToJSONString
    }
    await fetch(url,POSTOptions);
}