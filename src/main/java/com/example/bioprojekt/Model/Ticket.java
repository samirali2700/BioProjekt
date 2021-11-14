package com.example.bioprojekt.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ticket_id;
    private int screening_id;
    private int candy;
    private int phone;
    private int amount;
    private int totalPrice;

    public int getTicket_id() { return ticket_id; }
    public void setTicket_id(int ticket_id) { this.ticket_id = ticket_id; }

    public int getScreening_id() { return screening_id; }
    public void setScreening_id(int screening_id) { this.screening_id = screening_id; }

    public int getPhone() { return phone; }
    public void setPhone(int phone) { this.phone = phone; }

    public int getCandy() {
        return candy;
    }
    public void setCandy(int candy) {
        this.candy = candy;
    }

    public int getAmount() {
        return amount;
    }
    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getTotalPrice() { return totalPrice; }
    public void setTotalPrice(int totalPrice) { this.totalPrice = totalPrice; }

    @Override
    public String toString() {
        return "Ticket{" +
                "ticket_id=" + ticket_id +
                ", screening_id=" + screening_id +
                ", candy=" + candy +
                ", phone=" + phone +
                ", amount=" + amount+"}";
    }
}
