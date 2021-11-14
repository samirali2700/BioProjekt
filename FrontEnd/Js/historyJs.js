let ticketList = [];
let screeningList = [];
let movieList = [];
let historyList = [];

async function fetchAll(){
    //fetch Tickets
    let url = "http://localhost:8080/tickets";
    let promise = fetch(url).then(response => response.json());
    await promise.then(data => {
        data.forEach(ticket => {
            ticketList.push(ticket);
        });
    });

    //fetch Screening
    url = "http://localhost:8080/screenings";
    promise = fetch(url).then(response => response.json());
    await promise.then(data => {
        data.forEach(screening => {
            screeningList.push(screening)
        });
    });

    //fetch movies
    url = "http://localhost:8080/movies";
    promise = fetch(url).then(response => response.json());
    await promise.then(data => {
        data.forEach(movie => {
            movieList.push(movie);
        });
    });

    url = "http://localhost:8080/histories";
    promise = fetch(url).then(response => response.json());
    await promise.then(data => {
        data.forEach(history => {
            historyList.push(history);
        });
    });
}
(async function(){
    await fetchAll();
    setHistory();
})();

function setHistory(){
    const tbody = document.getElementById("tbody");
    const movieButton = document.getElementById("movieBtn");
    const screeningButton = document.getElementById("screeningBtn");
    let searchInput = document.getElementById("searchBar");
    let row;

    /*
    * Two Buttons are present in footer
    * each button has different view
    * one for history based on movies, the other on tickets/screening
    * for every time a button is clicked, the table is cleared and new thead and rows are loaded
    * the same method is repeated, but with different thead and data
    * */

    movieButton.addEventListener("click", () => {
        movieButton.id = "currentSearch";
        screeningButton.id = "";
        searchInput.placeholder = "Filter by Movie Id";

        setHead("movie");

           historyList.forEach(history => {
               movieList.forEach(movie => {
                   if(history.movie_id === movie.movie_id){
                       row = tbody.insertRow();
                       row.id = movie.movie_id;

                       row.insertCell(0).innerHTML = movie.movie_id;
                       row.insertCell(1).innerHTML = movie.movie_name;
                       row.insertCell(2).innerHTML = history.total_sales;
                       row.insertCell(3).innerHTML = history.screening_time;
                   }
               });
           });
    });

    screeningButton.addEventListener("click", () => {
        screeningButton.id = "currentSearch";
        movieButton.id = "";
        searchInput.placeholder = "Filter by Screening Id";

        setHead("tickets");

        ticketList.forEach(ticket => {
            row = tbody.insertRow();
            row.id = ticket.ticket_id;
            row.insertCell(0).innerHTML = ticket.ticket_id;
            row.insertCell(1).innerHTML = ticket.screening_id;
            row.insertCell(2).innerHTML = ticket.amount;
            row.insertCell(3).innerHTML = ticket.phone;
            row.insertCell(3).innerHTML = ticket.totalPrice;
        });
    });
}
function setHead(str){
    /*
    * Clearing row in case it is not empty
    * then clearing thead, to put in a new thead
    * */

    clearTable();
    const thead = document.getElementById("thead");
    if(thead.childElementCount !== 0){
        thead.children[0].remove();
    }

    /*Depending on button clicked, different thead values are defined*/
    let head = thead.insertRow();
    head.id = "tableHead";

    if(str === "tickets"){
        head.insertCell(0).outerHTML = "<th>Ticket ID</th>";
        head.insertCell(1).outerHTML = "<th>Screening ID</th>";
        head.insertCell(2).outerHTML = "<th>Amount</th>";
        head.insertCell(3).outerHTML = "<th>Phone</th>";
        head.insertCell(4).outerHTML = "<th>Total Price</th>";
    }
    else {
        head.insertCell(0).outerHTML = "<th>Movie ID</th>";
        head.insertCell(1).outerHTML = "<th>Movie Name</th>";
        head.insertCell(2).outerHTML = "<th>Sales</th>";
        head.insertCell(3).outerHTML = "<th>Screening Times</th>";
    }
}
function inputSearchBar(){
    // Defining tbody DOM, to manipulate later on
    const tbody = document.getElementById("tbody");

    /*
    * defining input bar DOM, and retrieving DOM with id
    * input is used to take value the user inputs ind the search bar
    * filterArea depends on which button is clicked, when clicked the id is set to 'currentSearch'
    * it is done to differentiate between the two types of filter options
    * no matter which filter option is running, the method traverse the selected list
    * and loads the match if there is any
    * */

    let input = document.getElementById("searchBar");
    let filterArea = document.getElementById("currentSearch");
    let row;

    clearTable();
    //using movie Id to filter
    if(filterArea.innerHTML === "Movies"){
        historyList.forEach(history => {
            movieList.forEach(movie => {
                if(history.movie_id === movie.movie_id){
                    if(input.value !== ''){

                        if(movie.movie_id === parseInt(input.value)) {
                            row = tbody.insertRow();
                            row.id = movie.movie_id;
                            row.insertCell(0).innerHTML = movie.movie_id;
                            row.insertCell(1).innerHTML = movie.movie_name;
                            row.insertCell(2).innerHTML = history.total_sales;
                            row.insertCell(3).innerHTML = history.screening_time;
                        }
                    }
                    else{
                        row = tbody.insertRow();
                        row.insertCell(0).innerHTML = movie.movie_id;
                        row.insertCell(1).innerHTML = movie.movie_name;
                        row.insertCell(2).innerHTML = history.total_sales;
                        row.insertCell(3).innerHTML = history.screening_time;
                    }
                }
            });
        });
    }
    //using screening id to filter
    else{
        ticketList.forEach(ticket => {
            if(x.value !== ''){
                if(parseInt(input.value) === parseInt(ticket.screening_id)){
                    row = tbody.insertRow();
                    row.insertCell(0).innerHTML = ticket.ticket_id;
                    row.insertCell(1).innerHTML = ticket.screening_id;
                    row.insertCell(2).innerHTML = ticket.amount;
                    row.insertCell(3).innerHTML = ticket.phone;
                    row.insertCell(3).innerHTML = ticket.totalPrice;
                }
            }
            else{
                row = tbody.insertRow();
                row.insertCell(0).innerHTML = ticket.ticket_id;
                row.insertCell(1).innerHTML = ticket.screening_id;
                row.insertCell(2).innerHTML = ticket.amount;
                row.insertCell(3).innerHTML = ticket.phone;
                row.insertCell(3).innerHTML = ticket.totalPrice;
            }
        });
    }
}
function clearTable(){
    const tbody = document.getElementById("tbody");
    if(tbody.childElementCount !== 0){
        while(tbody.firstChild){
            tbody.removeChild(tbody.firstChild);
        }
    }
}




