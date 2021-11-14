
//Global Variables
let screeningList = [];
let expiredList = [];

(async function(){
    await fetchScreening();
})()


//Fetch Screening Method
async function fetchScreening(){

    const url = "http://localhost:8080/screenings";

    //As long as list is not empty
    if(screeningList.length !== 0){screeningList = [];}
        const promise = fetch(url).then(response => response.json());
        await promise.then(data => {
            data.forEach(screening => {
                screeningList.push(screening);
            })
        })

    //Removing Screening that has passed current day from list
    let index = 0;
    screeningList.forEach(screening => {
        const screenDate = new Date(screening.date);
        const today = new Date();

        if(screenDate.getFullYear() === today.getFullYear()) {
            if (screenDate.getDate() < today.getDate()) {
                //all the screening that has pased current date will be put in expiredList
                expiredList.push(screening);
                screeningList.splice(index,1);
            }
        }
        index++;
    });

    /*
    * After fetch and screenings are sorted correctly
    * Page is updated with a list of screenings from screeningList
    * Two Methods, first setScreening  sets the table, each row is filled with data from screening
    * Second method, screeningDetail is to update page with further information regarding each row.
    * when a row is clicked, the information that were set in screeningDetail are viewed
    */
    setScreening(screeningList);
    screeningDetail(screeningList);

    //Button to change between active and inactive screenings
    const screeningBtn = document.getElementById("showExpiredScreening");

    screeningBtn.addEventListener("click", () =>{
        //every time screeningBtn is clicked, the view list is cleared
        clearScreeningList();
        assignSearch();

        const title = document.getElementById("title");

        /*
        * each time screeningBtn is clicked, different outcome is viewed
        * when the screening page is loaded for first time, the default list that is viewed is screeningList
        * when screeningBtn is clicked, by using title, the outcome is easy differentiated
        * by redifining title, and screeningBtn according to the viewed list
        * to switch between becomes easy.
        * first. clear list
        * second. check title name and compare
        * third. different properties are set, and list is update with new data
        * when viewing expired list, screeningDetail is not run, because to edit screening info when expired is waist.
        * */

        if(title.innerHTML === "Active Screenings") {
            title.innerHTML = "Inactive Screenings";
            screeningBtn.innerHTML = "Active Screenings";
            setScreening(expiredList);
        }
        else{
            title.innerHTML = "Active Screenings";
            screeningBtn.innerHTML = "Inactive Screenings";
            setScreening(screeningList);
            screeningDetail(screeningList);
        }
    })
}
function setScreening(list){
    /*
    * setScreening is a function that takes a list in parameter
    * setScreening filles the list viewed in screening page, what is viewed depends on the list referenced in parameter
    */

    const table = document.getElementById("screening-table");
    const tbody = document.getElementById("tbody");

    /*
    * By checking if tbody has an childelementCount higher then zero,
    * overpopulating the list the same information is prevented,
    * if childElementCount is higher, tbody is traverse as long as it contains a childNode
    * and each time it has the first child in tbody is remove, until there is no longer any childNodes in tbody
    */
    if(tbody.childElementCount !== 0){
        while(tbody.hasChildNodes()){
            tbody.firstChild.remove();
        }
    }
    //creating a td element for later use
    const td = document.createElement("td");

    //initializing date object with current date, to compare later on
    const today = new Date();

    //traversing list to properly fill all rows, cells, with needed data
    list.forEach(screening => {

        //data object is initialized with screening date
        const screenDate = new Date(screening.date);

                /*
                * defining and inserting a row, inside tbody
                * each time list is traveresed, a new row is inserted inside tbody (parent) element
                */
                const row = tbody.insertRow();

                //each row.id is set to match each screening row
                row.id = screening.screening_id;


                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);
                let cell5 = row.insertCell(4);
                let cell6 = row.insertCell(5);
                let cell7 = row.insertCell(6);
                let cell8 = row.insertCell(7);
                let cell9 = row.insertCell(8);


                //to define first cell with actual movie name, movie object is fetched using movie_id from screening
                const url = "http://localhost:8080/movie/" + screening.movie_id;
                fetch(url).then(response => response.json())
                    .then((obj) => {
                        cell1.innerHTML = obj.movie_name;
                    });

                //if screening seats is at low, it is styled with red color
                //no practical use, only easy differentiating between sales
                if (screening.seats_available === 0) {
                    cell3.style.color = "red";
                }

                cell2.innerHTML = screening.screening_room;
                cell3.innerHTML = screening.seats_available;
                cell4.innerHTML = screening.seats;
                cell5.innerHTML = screening.start_time;
                cell6.innerHTML = screening.end_time;

                /*
                * The date object initialized outside list loop is used here
                * the date object is compared to screening date
                * if current date and screening date is a match, the font is styled with a rgb color
                * no practical use, only extra features
                * */
                if(screenDate.toLocaleDateString() === today.toLocaleDateString()){
                    cell7.style.color = "rgb(74,255,0)";
                }

                cell7.innerHTML = screening.date;
                cell8.innerHTML = screening.sales;


                // A delete btn is put inside the last cell, for each row, this is done for easy access
                const deleteBtn = document.createElement("a");
                deleteBtn.className = "delete-screening";
                deleteBtn.id = screening.screening_id;

                cell9.appendChild(deleteBtn);
                deleteBtn.addEventListener("click", () =>{
                    deleteScreening(deleteBtn.id);
                });

    });
}
function clearScreeningList(){
    const tbody = document.getElementById("tbody");
    while(tbody.hasChildNodes()){
        tbody.firstChild.remove();
    }
}
async function deleteScreening(id){

    const url = "http://localhost:8080/deleteScreening/"+id;

        const promise =  fetch(url);
        await promise.catch(error => console.alert(error));

        clearScreeningList();
        await fetchScreening();
        setScreening(screeningList);
        screeningDetail(screeningList);
}
async function screeningDetail(list){
    const showScreening = document.querySelectorAll("tr");
    const table = document.querySelector("tbody");
    let tempP = document.createElement("p");
    let screeningObj;
    var movieObj;
    let screeningId;

    for(let row of showScreening){
        if(row.rowIndex !== 0) {
                /*
                * addEventListener is set on each cell for each row, except last cell
                * the last hold an 'a' element, if eventListener is on each row, compatibilty issues
                *
                 */
                for(let i = 0; i < row.cells.length-1; i++) {
                    row.cells.item(i).addEventListener("click", async () => {

                        //For closing the expanded Screening Details
                        if (row.className === "expand-state") {
                            row.className = "retract-state";                                                        //Changing ClassName to hide hole div
                            const tbody = document.querySelector("tbody");
                            tbody.removeChild(tbody.rows.item(row.rowIndex));                                       //Removing every child inside tbody element, using row.index to determine length
                        }
                        else {
                            row.className = "expand-state";                                                         //Re-defining Class Name, with css, div is easily made hidden and visible
                            screeningId = parseInt(row.id);                                                         //defining ScreeningID, just for easier overview

                            list.forEach(screening => {                                                    //traversing screening list, whilst using lambda function to access screening objects
                                if (screening.screening_id === screeningId) {
                                    screeningObj = screening;
                                    console.log(screening)
                                }
                            });


                            //fetching specific movie for screening
                            const movieUrl = "http://localhost:8080/movie/" + screeningObj.movie_id;                //Defining Movie url, to fetch a specific movie by Id
                            const promise = fetch(movieUrl).then(response => response.json());
                            await promise.then(data => {
                                movieObj = data;
                            });

                            //Defining needed elements for screening page
                            const detailRow = document.createElement("td");
                            const descriptionDiv = document.createElement("div");
                            const detailDiv = document.createElement("div");
                            const imgDiv = document.createElement("div");
                            const detailDiv1 = document.createElement("div");
                            const detailDiv2 = document.createElement("div");
                            const img = document.createElement("img");
                            const ticketDiv = document.createElement("div");


//settings for details row
                            detailRow.colSpan = 8;                                                                  //colSpan to span a single cell (td) over multiple cells, set to max
                            detailRow.id = "details";

//settings for detail div inside detail row
                            detailDiv.id = "detail-div";

                            //settings for Screening Details, first Div includes movie name, year, duration, actors
                                let label = document.createElement("label");
                                label.innerHTML = "Movie Name";
                                detailDiv1.append(label);

                                label = document.createElement("label");
                                label.innerHTML = "Year";
                                detailDiv1.append(label);

                                label = document.createElement("label");
                                label.innerHTML = "Duration";
                                detailDiv1.append(label);

                                label = document.createElement("label");
                                label.innerHTML = "Actors";
                                detailDiv1.append(label);


                            //settings for screening detail, these are values of previous labels
                                label = document.createElement("label");
                                label.innerHTML = movieObj.movie_name;
                                detailDiv2.append(label);

                                label = document.createElement("label");
                                label.innerHTML = movieObj.year;
                                detailDiv2.append(label);

                                label = document.createElement("label");
                                label.innerHTML = movieObj.duration + " minutes";
                                detailDiv2.append(label);

                                label = document.createElement("label");
                                label.innerHTML = movieObj.actors;
                                detailDiv2.append(label);

                            //putting 2 divs inside one div, containing both and is styled in css
                            detailDiv.append(detailDiv1);
                            detailDiv.append(detailDiv2);


                            //settings for img
                            img.id = "img";
                            imgDiv.id = "img-div";
                            img.src = movieObj.imgUrl;
                            imgDiv.append(img);


                            //settings for description div
                            descriptionDiv.id = "description-div";
                                let div = document.createElement("div");
                                let title = document.createElement("h1");
                                title.innerHTML = "Description";
                                div.append(title);
                                descriptionDiv.append(div);

                                div = document.createElement("div");
                                let p = document.createElement("p");
                                p.innerHTML = movieObj.description;
                                div.append(p);
                            descriptionDiv.append(div);

                            /*      Information Div
                            *  Ticket Div when first loaded the div will be hidden and emtpy
                            *  The div will only hold to a tags, these tags when clicked will load a div container
                            *  it wil container different elements depending on which a tag clicked
                            *  The a tag can alson expand and retract empty the contains of the div to free workload
                            * */


                            ticketDiv.id = "retracted";
                            ticketDiv.className = "conDivRetract";


                            /*Edit Screening a tag*/
                            const editScreening = document.createElement("a");                               //a single a element, to use as an icon
                            editScreening.className = "edit-screening";

                            /*Buy Ticket a tag*/
                            const expandTicket = document.createElement("a");                               //a single a element, to use as an icon
                            expandTicket.className = "expand-div";


                            /*  Configuration Area      incl.   Ticket Buy & Screening Edit*/
                            expandTicket.addEventListener("click", () => {
                                let tempDiv = document.createElement("div");
                                tempDiv.className = "ticket-form";

                                if(ticketDiv.id === "retracted"){
                                    ticketDiv.id = "expanded";
                                    expandTicket.className = "retract-div";
                                    editScreening.className = "hiddenDiv";


                                    label = document.createElement("label");
                                    label.innerHTML = "Amount (105kr):";
                                    let input = document.createElement("input");
                                    input.type = "number";
                                    input.id = "amount";
                                    tempDiv.append(label);
                                    tempDiv.append(input);

                                    label = document.createElement("label");
                                    label.innerHTML = "Candy (kr):";
                                    input = document.createElement("input");
                                    input.type = "number";
                                    input.id = "candy";
                                    tempDiv.append(label);
                                    tempDiv.append(input);

                                    label = document.createElement("label");
                                    label.innerHTML = "Phone Number:";
                                    input = document.createElement("input");
                                    input.type = "number";
                                    input.id = "phone";
                                    tempDiv.append(label);
                                    tempDiv.append(input);


                                    let button = document.createElement("button");

                                    button.innerHTML = "Bekræft";
                                    button.className = "add-btn";
                                    button.id = "confirm-ticket";


                                    /*  If there are no more seats left */
                                    if (screeningObj.seats_available == 0) {
                                        tempDiv.className = "hiddenDiv";
                                        let p = document.createElement("p");
                                        p.innerHTML = "Sold Out, No Available Seats Left";
                                        p.id = "noSeatLeft";
                                        p.style.border = "1px solid rgba(128, 128, 128, 0.71)";
                                        p.style.padding = "25px 0";
                                        p.className = "visibleDiv";
                                        ticketDiv.style.marginBottom = "-400px";
                                        expandTicket.className = "hiddenDiv";
                                        ticketDiv.append(p);
                                        button.className = "hiddenDiv";
                                    }


                                    /*  Ticket Confirmation */
                                    button.addEventListener("click", async () => {
                                        let tempAmount = document.getElementById("amount");
                                        let tempCandy = document.getElementById("candy");
                                        let tempPhone = document.getElementById("phone");

                                        //Defining Object to save to Db, Class Ticket
                                        const JSONTicket = {
                                            candy: tempCandy.value,
                                            amount: tempAmount.value,
                                            phone: tempPhone.value,
                                            screening_id: screeningId,
                                            totalPrice: tempCandy.value + (105 * tempAmount.value)
                                        };
                                        const JSONHistory = {
                                            movie_id: screeningObj.movie_id,
                                            screening_time: 1,
                                            total_sales: tempAmount.value
                                        }

                                        const JSONTObj = JSON.stringify(JSONTicket);                                        //Strinigify method
                                        const JSONObjH = JSON.stringify(JSONHistory);

                                        const JSONOptions = {
                                            method: "POST",
                                            headers: {
                                                "Content-type": "application/json"
                                            },
                                            body: JSONTObj
                                        };
                                        const JSONOptionsH = {
                                            method: "POST",
                                            headers: {
                                                "Content-type": "application/json"
                                            },
                                            body: JSONObjH
                                        }


                                        let ticketUrl = "http://localhost:8080/saveTicket";
                                        let historyUrl = "http://localhost:8080/saveHistory";

                                        try {
                                            await fetch(ticketUrl, JSONOptions);
                                            await fetch(historyUrl, JSONOptionsH);

                                        } catch (error) {
                                            console.log("Something went Wrong In POST Screening: " + error);
                                        }


                                        while(tempDiv.hasChildNodes()){
                                            tempDiv.firstChild.remove();
                                        }
                                        tempDiv.className = "confirmation";

                                        tempP.style.textAlign = "center";
                                        tempP.style.fontSize = "22px";
                                        tempP.innerHTML = "Ticket(s) Created Successfully";
                                        tempP.className = "visibleDiv";


                                        tempDiv.append(tempP);

                                        setTimeout(function () {
                                            window.location.reload(1);
                                        }, 750);

                                    });
                                    tempDiv.appendChild(button);
                                    ticketDiv.append(tempDiv);
                                }
                                else{
                                    ticketDiv.lastElementChild.remove();
                                    expandTicket.className = "expand-div";
                                    ticketDiv.id = "retracted";
                                    editScreening.className = "edit-screening";
                                }
                            });
                            editScreening.addEventListener("click", () => {

                                let tempDiv = document.createElement("div");
                                tempDiv.className = "screening-form";

                                if (ticketDiv.id === "retracted") {
                                    expandTicket.className = "hiddenDiv";
                                    while(tempDiv.hasChildNodes()){
                                        tempDiv.firstChild.remove();
                                    }

                                    ticketDiv.id = "expanded";

                                    const table = document.createElement("table");
                                    const thead = document.createElement("thead");
                                    const tbody = document.createElement("tbody");

                                    let headRow = thead.insertRow(0);
                                    let cell1 = headRow.insertCell(0)
                                    let cell2 = headRow.insertCell(1);
                                    let cell3 = headRow.insertCell(1);
                                    let cell4 = headRow.insertCell(1);

                                    cell1.outerHTML = "<th>Room</th>"
                                    cell2.outerHTML = "<th>Total Seats</th>"
                                    cell3.outerHTML = "<th>Start Time</th>"
                                    cell4.outerHTML = "<th>Date</th>"

                                    let row = tbody.insertRow(0);
                                    cell1 = row.insertCell(0);
                                    cell2 = row.insertCell(1);
                                    cell3 = row.insertCell(2);
                                    cell4 = row.insertCell(3);


                                    let inputRoom = document.createElement("input");
                                    inputRoom.setAttribute("type", "number");
                                    inputRoom.value = screeningObj.screening_room;
                                    cell1.appendChild(inputRoom);

                                    let inputDate = document.createElement("input");
                                    inputDate.setAttribute("type", "text");
                                    inputDate.value = screeningObj.date;
                                    cell2.appendChild(inputDate);


                                    let inputTime = document.createElement("input");
                                    inputTime.setAttribute("type", "time");
                                    inputTime.value = screeningObj.start_time;
                                    cell3.appendChild(inputTime);


                                    let inputSeats = document.createElement("input");
                                    inputSeats.setAttribute("type", "number");
                                    inputSeats.value = screeningObj.seats;
                                    cell4.appendChild(inputSeats);


                                    table.appendChild(thead);
                                    table.appendChild(tbody);


                                    let confirmButton = document.createElement("button");
                                    confirmButton.className = "add-btn";
                                    confirmButton.innerHTML = "Save Change";
                                    confirmButton.style.marginTop = "15px";
                                    confirmButton.style.float = "right";


                                    confirmButton.addEventListener("click",async () =>{
                                        let endTime = inputTime.value.split(":");
                                        let tempDuration = movieObj.duration;
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
                                            screening_id: screeningObj.screening_id,
                                            movie_id: screeningObj.movie_id,
                                            screening_room : inputRoom.value,
                                            seats : inputSeats.value,
                                            seats_available : (inputSeats.value - screeningObj.sales),
                                            date: inputDate.value,
                                            start_time: inputTime.value,
                                            end_time: end_time,
                                            sales: screeningObj.sales
                                        }

                                        const JSONObjectToJSONString = JSON.stringify(screeningJSON);
                                        const POSTOptions = {
                                            method:"POST",
                                            headers:{
                                                "Content-type": "application/json"
                                            },
                                            body: JSONObjectToJSONString
                                        }
                                        await fetch("http://localhost:8080/saveScreening",POSTOptions);
                                        window.location.href = "Screening.html";
                                    })

                                    tempDiv.appendChild(table);
                                    tempDiv.appendChild(confirmButton);

                                    ticketDiv.appendChild(tempDiv);

                                }
                                else {
                                    ticketDiv.lastElementChild.remove();
                                    ticketDiv.id = "retracted";
                                    expandTicket.className = "expand-div";
                                }

                            });

                            const headerDiv = document.createElement("div");
                            headerDiv.appendChild(expandTicket);
                            headerDiv.appendChild(editScreening);

                            ticketDiv.appendChild(headerDiv);

                            const parentDiv = document.createElement("div");
                            parentDiv.className = "infoContainer";
                            parentDiv.appendChild(imgDiv);
                            parentDiv.appendChild(detailDiv);
                            parentDiv.appendChild(descriptionDiv);



                            detailRow.appendChild(parentDiv);
                            detailRow.appendChild(ticketDiv);
                            let newRow = table.insertRow(row.rowIndex);
                            newRow.id = "temp-row" + row.rowIndex;
                            newRow.className = "det-row";


                            //row settings
                            newRow.append(detailRow);
                        }
                    });
                }
        }
    }

}
function clearParent(elementName){
    const parent = document.getElementById(elementName);
    while(parent.hasChildNodes()){
        parent.firstChild.remove();
    }
}

/*          Filter  Function    */
let filterFlag = null;

const startTime = document.getElementById("startTime");
    startTime.addEventListener("click", () => {
    if(filterFlag === false){
        filterFlag = true;
    }
    else {
        filterFlag = false;
    }
    assignSearch();
    startTime.className = "searchedBy";
    clearScreeningList();

    if(document.getElementById("showExpiredScreening").innerHTML === "Active Screenings"){
        expiredList.sort(compareByStart);
        setScreening(expiredList);
    }else{
        screeningList.sort(compareByStart);
        setScreening(screeningList)
        screeningDetail(screeningList);
    }
});
const endTime = document.getElementById("endTime");
    endTime.addEventListener("click",() => {
    if(filterFlag === false){
        filterFlag = true;
    }
    else {
        filterFlag = false;
    }
    assignSearch();
    endTime.className = "searchedBy";
    clearScreeningList();

    if(document.getElementById("showExpiredScreening").innerHTML === "Active Screenings"){
        expiredList.sort(compareByEnd);
        setScreening(expiredList);
    }else{
        screeningList.sort(compareByEnd);
        setScreening(screeningList)
        screeningDetail(screeningList);
    }
});
const screeningRoom = document.getElementById("screeningRoom");
    screeningRoom.addEventListener("click",() => {
    if(filterFlag === false){
        filterFlag = true;
    }
    else {
        filterFlag = false;
    }
    assignSearch();
    screeningRoom.className = "searchedBy";
    clearScreeningList();

    if(document.getElementById("showExpiredScreening").innerHTML === "Active Screenings"){
        expiredList.sort(compareByRoom);
        setScreening(expiredList);
    }else{
        screeningList.sort(compareByRoom);
        setScreening(screeningList)
        screeningDetail(screeningList);
    }
});
const screeningDate = document.getElementById("screeningDate");
    screeningDate.addEventListener("click",() => {
    if(filterFlag === false){
        filterFlag = true;
    }
    else {
        filterFlag = false;
    }
    assignSearch();
    screeningDate.className = "searchedBy";
    clearScreeningList();

    if(document.getElementById("showExpiredScreening").innerHTML === "Active Screenings"){
        expiredList.sort(compareByDate);
        setScreening(expiredList);
    }else{
        screeningList.sort(compareByDate);
        setScreening(screeningList)
        screeningDetail(screeningList);
    }
});
const totalSeats = document.getElementById("totalSeats");
    totalSeats.addEventListener("click",() => {
    if(filterFlag === false){
        filterFlag = true;
    }
    else {
        filterFlag = false;
    }
    assignSearch();
    totalSeats.className = "searchedBy";
    clearScreeningList();

    if(document.getElementById("showExpiredScreening").innerHTML === "Active Screenings"){
        expiredList.sort(compareByTotalSeats);
        setScreening(expiredList);
    }else{
        screeningList.sort(compareByTotalSeats);
        setScreening(screeningList)
        screeningDetail(screeningList);
    }
});
const availableSeats = document.getElementById("availableSeats");
    availableSeats.addEventListener("click",() => {
    if(filterFlag === false){
        filterFlag = true;
    }
    else {
        filterFlag = false;
    }
    assignSearch();
    availableSeats.className = "searchedBy";
    clearScreeningList();

    if(document.getElementById("showExpiredScreening").innerHTML === "Active Screenings"){
        expiredList.sort(compareByAvailableSeats);
        setScreening(expiredList);
    }else{
        screeningList.sort(compareByAvailableSeats);
        setScreening(screeningList)
        screeningDetail(screeningList);
    }
});
const sales = document.getElementById("sales");
    sales.addEventListener("click",() => {
    if(filterFlag === false){
        filterFlag = true;
    }
    else {
        filterFlag = false;
    }
    assignSearch();
    sales.className = "searchedBy";
    clearScreeningList();

    if(document.getElementById("showExpiredScreening").innerHTML === "Active Screenings"){
        expiredList.sort(compareBySales);
        setScreening(expiredList);
    }else{
        screeningList.sort(compareBySales);
        setScreening(screeningList)
        screeningDetail(screeningList);
    }
});
    
    
//CompareTo Methods
function compareByStart(a,b){

    let aHour = a.start_time.split(":")[0];
    let aMinute = a.start_time.split(":")[1];
    let bHour = b.start_time.split(":")[0];
    let bMinute = b.start_time.split(":")[1];


    if(filterFlag === false) {
        if(aHour < bHour){
            return -1;
        }
        if(aHour > bHour){
            return 1;
        }
        if(aHour === bHour){
            if(aMinute < bMinute){
                return -1;
            }
            if(aMinute > bMinute){
                return 1;
            }
            return 0;
        }
        return 0;
    }
    else{
        if(aHour > bHour){
            return -1;
        }
        if(aHour < bHour){
            return 1;
        }
        if(aHour === bHour){
            if(aMinute > bMinute){
                return -1;
            }
            if(aMinute < bMinute){
                return 1;
            }
            return 0;
        }
        return 0;
    }
}
function compareByRoom(a,b){
     if(filterFlag) {
         if (a.screening_room < b.screening_room) {
             return -1;
         }
         if (a.screening_room > b.screening_room) {
             return 1;
         }
         return 0;
     }
     else{
        if (a.screening_room > b.screening_room) {
            return -1;
        }
        if (a.screening_room < b.screening_room) {
            return 1;
        }
        return 0;
    }

}
function compareByEnd(a,b){
    let aHour = a.end_time.split(":")[0];
    let aMinute = a.end_time.split(":")[1];
    let bHour = b.end_time.split(":")[0];
    let bMinute = b.end_time.split(":")[1];


    if(filterFlag === false) {
        if(aHour < bHour){
            return -1;
        }
        if(aHour > bHour){
            return 1;
        }
        if(aHour === bHour){
            if(aMinute < bMinute){
                return -1;
            }
            if(aMinute > bMinute){
                return 1;
            }
            return 0;
        }
        return 0;
    }
    else{
        if(aHour > bHour){
            return -1;
        }
        if(aHour < bHour){
            return 1;
        }
        if(aHour === bHour){
            if(aMinute > bMinute){
                return -1;
            }
            if(aMinute < bMinute){
                return 1;
            }
            return 0;
        }
        return 0;
    }
}
function compareByDate(a,b){
     let aMonth = a.date.split("-")[1];
     let aDay = a.date.split("-")[2];
     let bMonth = b.date.split("-")[1];
     let bDay = b.date.split("-")[2];

     if(filterFlag === false) {

         if(parseInt(aMonth) < parseInt(bMonth)){return -1;}
         if(parseInt(aMonth) > parseInt(bMonth)){return 1;}
         if(parseInt(aMonth) === parseInt(bMonth)){

             if(parseInt(aDay) < parseInt(bDay)){
                 return -1;
             }
             if(parseInt(aDay) > parseInt(bDay)){
                 return 1;
             }
             return 0;
         }
         return 0;
     }
     else {
         if(parseInt(aMonth) > parseInt(bMonth)){return -1;}
         if(parseInt(aMonth) < parseInt(bMonth)){return 1;}
         if(parseInt(aMonth) === parseInt(bMonth)){
             if(parseInt(aDay) > parseInt(bDay)){return -1;}
             if(parseInt(aDay) < parseInt(bDay)){return 1;}
             //return 0;
         }
         return 0;
     }
}
function compareByTotalSeats(a,b){
     if(filterFlag === false) {
         if (a.seats < b.seats) {
             return -1;
         }
         if (a.seats > b.seats) {
             return 1;
         }
         return 0;
     }
     else{
         if (a.seats > b.seats) {
             return -1;
         }
         if (a.seats < b.seats) {
             return 1;
         }
         return 0;
     }
}
function compareByAvailableSeats(a,b){
    if(filterFlag === false) {
        if (a.seats_available < b.seats_available) {
            return -1;
        }
        if (a.seats_available > b.seats_available) {
            return 1;
        }
        return 0;
    }
    else{
        if (a.seats_available > b.seats_available) {
            return -1;
        }
        if (a.seats_available < b.seats_available) {
            return 1;
        }
        return 0;
    }
}
function compareBySales(a,b){

     if(filterFlag === false){
         if(a.sales < b.sales){
             return -1;
         }
         if(a.sales > b.sales){
             return 1;
         }
         return 0;
     }
     else{
         if(a.sales > b.sales){
             return -1;
         }
         if(a.sales < b.sales){
             return 1;
         }
         return 0;
     }
}


function assignSearch(){
    const temp = document.getElementsByClassName("searchedBy");
    if(temp.length !== 0){
        temp.item(0).className = "";
    }
}

