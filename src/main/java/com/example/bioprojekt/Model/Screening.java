package com.example.bioprojekt.Model;

import javax.persistence.*;
import java.sql.Time;
@Entity
public class Screening  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int screening_id;
    private int screening_room;
    private int movie_id;
    private String start_time;
    private String end_time;
    private int seats;
    private int seats_available;
    private String date;
    private int sales;


    public int getScreening_id() { return screening_id; }
    public void setScreening_id(int screening_id) { this.screening_id = screening_id; }

    public int getScreening_room() { return screening_room; }
    public void setScreening_room(int screening_room) { this.screening_room = screening_room; }

    public int getMovie_id() { return movie_id; }
    public void setMovie_id(int movie_id) { this.movie_id = movie_id; }

    public String getStart_time() { return start_time; }
    public void setStart_time(String start_time) { this.start_time = start_time; }

    public String getEnd_time() { return end_time; }
    public void setEnd_time(String end_time) { this.end_time = end_time; }

    public int getSeats() { return seats; }
    public void setSeats(int seats) { this.seats = seats; }

    public int getSeats_available() { return seats_available; }
    public void setSeats_available(int seats_available) { this.seats_available = seats_available; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getSales() { return sales; }
    public void setSales(int sales) { this.sales = sales; }

    public String toString(){
        return "Screening Id: "+screening_id+" - Movie Id: "+movie_id+" - Room: "+screening_room+" - Seats: "+seats+" - Start time: "+start_time+" - End time: "+end_time+" - Date: "+date;
    }
    public void sellTicket(int amount){
            sales += amount;
            seats_available -= amount;
    }



}

