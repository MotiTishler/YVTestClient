import { Component, Input } from '@angular/core';
import { AvailableTickets } from 'src/app/models/available-tickets.model';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-luz-item',
  templateUrl: './luz-item.component.html',
  styleUrls: ['./luz-item.component.css']
})
export class LuzItemComponent {

  @Input() item:AvailableTickets

  constructor(public ticketsService:TicketsService){}

  onClick(){
    if (!this.item.isClosed && this.item.availablePlaces > 0) this.ticketsService.setCurrentTime(this.item);
  }

  displayAmount():string{
    if (this.item.isClosed) return 'סגור';
    if (this.item.availablePlaces <= 0) return 'אזלו';
    return `${this.item.availablePlaces} כרטיסים`;
  }
}
