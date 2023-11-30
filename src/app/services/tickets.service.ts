import { Injectable } from '@angular/core';
import { AvailableTickets } from '../models/available-tickets.model';
import { Order } from '../interfaces/order';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  //THE data
  public luz:AvailableTickets[] = [];   //The full list of start hours - got from server
  public currentTime:AvailableTickets = undefined;    //The selected hour - got from component
  
  //Auxiliary arrays dividing the opening hours into morning, noon and afternoon
  public morning:number[] = [];
  public noon:number[] = [];
  public afternoon:number[] = [];

  constructor(
    private http:HttpClient
  ) { }


  // Methods for dealing with server
  // -------------------------------
  
  public askForList(){
    //get list from server 
    return this.http.get('https://localhost:7150/Tickets/list');
  }

  orderTickets(bdy:Order){
    //post to server
    return this.http.post('https://localhost:7150/Tickets' ,bdy, {
      headers:{
        'Content-Type':"application/json"
      }
    })
  }


  // Methods for internal use
  // ------------------------

  public setCurrentTime(t:AvailableTickets){
    this.currentTime = t;
  }

  public clearCurrentTime(){
    this.currentTime = undefined;
  }

  public getTimesForHour = (hour:number)=>this.luz.filter(t=>t.hour == hour);
}
