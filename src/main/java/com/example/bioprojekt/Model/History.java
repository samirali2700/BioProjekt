package com.example.bioprojekt.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int history_id;
    private int movie_id;

    private int screening_time;
    private int total_sales;

    public int getHistory_id() { return history_id; }
    public void setHistory_id(int history_id) { this.history_id = history_id; }

    public int getMovie_id() { return movie_id; }
    public void setMovie_id(int movie_id) { this.movie_id = movie_id; }

    public int getScreening_time() { return screening_time; }
    public void setScreening_time(int screening_time) { this.screening_time += screening_time; }

    public int getTotal_sales() { return total_sales; }
    public void setTotal_sales(int total_sales) { this.total_sales += total_sales; }


}
