package com.example.bioprojekt.RESTController;

import com.example.bioprojekt.Model.History;
import com.example.bioprojekt.Model.Movie;
import com.example.bioprojekt.Model.Screening;
import com.example.bioprojekt.Model.Ticket;
import com.example.bioprojekt.Repository.HistoryRepository;
import com.example.bioprojekt.Repository.MovieRepository;
import com.example.bioprojekt.Repository.ScreeningRepository;
import com.example.bioprojekt.Repository.TicketRepository;
import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@CrossOrigin("*")
@org.springframework.web.bind.annotation.RestController
public class RestController {

    @Autowired
    MovieRepository movieRepository;
    @Autowired
    ScreeningRepository screeningRepository;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    HistoryRepository historyRepository;


    //simple list fetch methods
    @GetMapping("/movies")
    public List<Movie> fetchMovies(){
        return movieRepository.findAll();
    }
    @GetMapping("/screenings")
    public List<Screening> fetchScreenings(){ return  screeningRepository.findAll(); }
    @GetMapping("/tickets")
    public List<Ticket> fetchTickets(){ return ticketRepository.findAll(); }
    @GetMapping("/histories")
    public List<History> fetchHistories(){ return historyRepository.findAll();}



    //fetch By Id methods
    @GetMapping("/movie/{movie_id}")
    public Optional<Movie> getMovieById(@PathVariable int movie_id){
        return movieRepository.findById(movie_id);
    }
    @GetMapping("/screening/{screening_id}")
    public Optional<Screening> getScreeningById(@PathVariable int screening_id){ return screeningRepository.findById(screening_id); }



    //save methods
    @PostMapping(value = "saveMovie", consumes = "application/json")
    public void saveMovie(@RequestBody Movie movie){
        System.out.println(movie.toString());
        movieRepository.save(movie);
    }
    @PostMapping(value = "saveScreening",consumes = "application/json")
    public void saveScreening(@RequestBody Screening screening){
        System.out.println(screening); screeningRepository.save(screening); }
    @PostMapping(value = "saveHistory", consumes = "application/json")
    public void saveHistory(@RequestBody History history){

        List<History> list = historyRepository.findAll();
        AtomicBoolean flag = new AtomicBoolean(false);

        list.forEach((h) -> {

            if(h.getMovie_id() == history.getMovie_id()){
                flag.set(true);
                h.setScreening_time(history.getScreening_time());
                h.setTotal_sales(history.getTotal_sales());
                historyRepository.save(h);
            }
        });
        if(!flag.get()) {
            historyRepository.save(history);
        }

    }

    @PostMapping(value = "saveTicket", consumes = "application/json")
    public void saveTicket(@RequestBody Ticket ticket){
        Optional<Screening> screening = screeningRepository.findById(ticket.getScreening_id());
        screening.get().sellTicket(ticket.getAmount());         //Changing some properties of screening according to ticket
                                                                //seelTicket method in screening class, sales and seats_available are effected
        screeningRepository.save(screening.get());
        ticketRepository.save(ticket);
    }



    //delete method
    @GetMapping("/setActivity/{movie_id}")
    public ResponseEntity<Boolean> setMovieActivity(@PathVariable int movie_id){

        List<Screening> screeningList = screeningRepository.findAll();
        AtomicBoolean flag = new AtomicBoolean(false);

        screeningList.forEach(s -> {
            if(movie_id == s.getMovie_id()){
                flag.set(true);
            }
        });

        if(!flag.get()){
            Optional<Movie> movie = movieRepository.findById(movie_id);
            if(movie.get().getActivity().equals("active")) {
                movie.get().setActivity("inactive");
            }else{
                movie.get().setActivity("active");
            }
            movieRepository.save(movie.get());
        }
        return new ResponseEntity<Boolean>(flag.get(),HttpStatus.ACCEPTED);
    }
    @GetMapping("/deleteScreening/{screening_id}")
    public void deleteScrenning(@PathVariable int screening_id){
        screeningRepository.deleteById(screening_id);
    }
    @GetMapping("/deleteMovie/{movie_id}")
    public void deleteMovie(@PathVariable int movie_id){
        movieRepository.deleteById(movie_id);
    }



}
