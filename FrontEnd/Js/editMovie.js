
showMovie();

async function showMovie(){
    //Der er sikkert andre nemmere metoder, dog fandt jeg dette til at være bedste løsning for mig
    const movieId = window.location.href.split("?")[1].split("=")[1];

    const movieObj = await fetchMovieById(movieId);
    const parentDiv = document.getElementById("movieShowInfo");
    document.querySelector(".hero-header").id = movieObj.movie_id;



    let childDiv = document.createElement("div");
    childDiv.id ="movieInfo";

    let imgDiv = document.createElement("div");
    imgDiv.id = "movieImg";
    let img = document.createElement("img");
    img.src = movieObj.imgUrl;

    let title = document.getElementById("title");
    title.innerHTML = movieObj.movie_name;

    let inputName = document.createElement("input");
    let label = document.createElement("label");
    inputName.type = "text";
    inputName.value = movieObj.movie_name;

    label.innerHTML = "Movie Name";
    inputName.oninput = () => {
        document.getElementById("title").innerHTML = inputName.value;
    }

    childDiv.append(label);
    childDiv.append(inputName);

    let inputYear = document.createElement("input");
    label = document.createElement("label");
    label.innerHTML = "Year";
    inputYear.type = "number";
    inputYear.value = movieObj.year;
    childDiv.append(label);
    childDiv.append(inputYear);



    let inputActor = document.createElement("input");
    label = document.createElement("label");
    label.innerHTML = "Actors";
    inputActor.type = "text";
    inputActor.value = movieObj.actors;
    childDiv.append(label);
    childDiv.append(inputActor);

    let inputDuration = document.createElement("input");
    label = document.createElement("label");
    label.innerHTML = "Duration";
    inputDuration.type = "number";
    inputDuration.value = movieObj.duration;
    childDiv.append(label);
    childDiv.append(inputDuration);

    let imgInput = document.createElement("input");
    label = document.createElement("label");
    label.innerHTML = "Img Url";
    imgInput.type = "text";
    imgInput.value = movieObj.imgUrl;
    imgInput.oninput = () => {
        img.src = imgInput.value;
    }
    childDiv.append(label);
    childDiv.append(imgInput);

    let textArea = document.createElement("textarea");
    label = document.createElement("label");
    label.innerHTML = "Description";
    textArea.type = "text";
    textArea.innerHTML = movieObj.description;
    textArea.id = "description";
    textArea.style.height = "105px";
    textArea.style.resize = "none";
    childDiv.append(label);
    childDiv.append(textArea);

    imgDiv.append(img);
    parentDiv.append(imgDiv);
    parentDiv.append(childDiv);
    let submitBtn = document.createElement("button");
    let activityBtn = document.createElement("button");
    let footer = document.createElement("div");
    footer.id = "footer";
    submitBtn.id = "save-btn";
    activityBtn.id = "delete-btn";
    submitBtn.innerHTML = "Save";

    if(movieObj.activity === "active") {
        activityBtn.innerHTML = "Set Inactive";
    }else{
        activityBtn.innerHTML = "Set Active";
    }

    activityBtn.addEventListener("click", () =>  setActivity(movieObj.movie_id));
    submitBtn.addEventListener("click", () => updateMovie(movieObj.movie_id));
    footer.append(activityBtn);
    footer.append(submitBtn);
    parentDiv.append(footer);


}
async function fetchMovieById(id){
    const url = "http://localhost:8080/movie/"+id;
    let movieObj;

    try{
        await fetch(url).then(response => response.json()).
        then(obj => {
            movieObj = obj;
        })

    }catch(er){
        console.log("Failed To Fetch Movie By ID: "+er);
    }
    return movieObj;
}
async function setActivity(id){
    let screeningFlag;
    const url = "http://localhost:8080/setActivity/"+id;
    try {
        const promise =  fetch(url).then((response) => {
            response.text().then(a => {
                 screeningFlag = a
            }).catch(error => console.warn(error))}).catch(error => console.warn(error));
        await promise;


        setTimeout(() => {
            if(screeningFlag === 'true') {
                console.log(screeningFlag)
                alert("Failed To Set Inactive, Movie currently assigned Screening");
            }
        }, 0);
    }
    catch(er){
        console.log("Failed To Delete Movie id("+id+"): "+er);
    }
    window.location.href = "Movie.html";
}

async function updateMovie(id){

    let inputs = document.querySelectorAll("input");
    let textArea = document.querySelector("textarea");


    let movieName = inputs[0].value;
    let years = inputs[1].value;
    let actor = inputs[2].value;
    let duration = inputs[3].value;
    let imgUrl = inputs[4].value;
    let description = textArea.innerHTML;

    const MovieObj = {
        movie_id: id,
        movie_name: movieName,
        year: years,
        actors: actor,
        duration: duration,
        imgUrl: imgUrl,
        description: description
    }

    const JSONObjectToJSONString = JSON.stringify(MovieObj);

    const POSTOptions = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSONObjectToJSONString
    }
    await  fetch("http://localhost:8080/saveMovie",POSTOptions);

    window.location.href = "Movie.html";
}