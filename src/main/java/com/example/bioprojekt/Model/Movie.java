package com.example.bioprojekt.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int movie_id;
    private String movie_name;
    private int duration;//Minutes
    private String description;
    private String actors;
    private String imgUrl;
    private int year;
    private String activity;

    public int getMovie_id() { return movie_id; }
    public void setMovie_id(int movie_id) { this.movie_id = movie_id; }

    public String getMovie_name() { return movie_name; }
    public void setMovie_name(String movie_name) { this.movie_name = movie_name; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getActors() { return actors; }
    public void setActors(String actors) { this.actors = actors; }

    public String getImgUrl(){return imgUrl;}
    public void setImgUrl(String imgUrl){this.imgUrl = imgUrl;}

    public int getYear(){return year; }
    public void setYear(int year){this.year = year;}

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    @Override
    public String toString() {
        return "Movie{movie_id=" + movie_id +", movie_name='" + movie_name +", duration=" + duration + ", description='" + description  + ", actors='" + actors  + ", imgUrl='" + imgUrl + ", year=" + year + '}';
    }
}
