import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from 'src/app/interfaces/order';
import { AvailableTickets } from 'src/app/models/available-tickets.model';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-tickets-area',
  templateUrl: './tickets-area.component.html',
  styleUrls: ['./tickets-area.component.css']
})
export class TicketsAreaComponent implements OnInit {

  public amount:number = 1;
  public curDate:string = new Date().toLocaleDateString();

  constructor(
    public ticketsService:TicketsService,
    private sneakBar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.askForList();

    // refresh list every 10 minutes
    // in the real world - we'll do it in the server side using web socket
    setInterval(this.askForList, 10*60*1000);
  }


  //ask service for list
  askForList(){
    this.ticketsService.askForList().subscribe(
      (res:any)=>{
        
        //assign res to ticketsService          
        this.ticketsService.luz.length = 0;     
        res.forEach(element => {
          this.ticketsService.luz.push(new AvailableTickets(element.startTime, element.availablePlaces, element.isClosed));
        }); 


        //dividing the opening hours into morning, noon and afternoon
        let openingHours = this.ticketsService.luz
                                .map(t=>t.hour)
                                .filter((value, index, self)=>self.indexOf(value) === index);

        this.ticketsService.morning = openingHours.filter(h=> h<12);
        this.ticketsService.noon = openingHours.filter(h=> h>=12 && h<=15);
        this.ticketsService.afternoon = openingHours.filter(h=> h>15);

      },
      (err:any)=>{
        console.log(err);
          //in real world call an error handler
      }
    );

  }


  //order service to post order
  orderTickets(){
    if (!this.ticketsService.currentTime) this.showSneakBar('לא בחרת שעת כניסה');
    else if (this.amount <= 0) this.showSneakBar('לא בחרת מספר מבקרים');
    else if (this.ticketsService.currentTime.isClosed) this.showSneakBar('המוזיאון סגור בשעה זו');
    else if (this.ticketsService.currentTime.availablePlaces == 0) this.showSneakBar('אזלו הכרטיסים לשעה זו');
    else if (this.ticketsService.currentTime.availablePlaces < this.amount) this.showSneakBar('מספר הכרטיסים המבוקש גדול מדי');
    else {
      this.ticketsService.orderTickets({startTime:this.ticketsService.currentTime.startTime , amount:this.amount}).subscribe(
        (res:Order)=>{

          if (res.amount > 0) {
            this.showSneakBar(`הזמנת ${ res.amount } כרטיסים לשעה ${ res.startTime } נקלטה בהצלחה`);
            this.ticketsService.currentTime.availablePlaces -= res.amount;
            this.ticketsService.clearCurrentTime();
          }
          else {
            this.showSneakBar('לצערנו, הזמנת הכרטיסים נכשלה.');
            // ----> advanced: show different message for each error code <--------
          }

        },
        (err:any)=>{
          console.log(err);
          //in real world call an error handler
        }
      );
    }
  }


  //Auxiliary method
  private showSneakBar = (msg:string)=>{this.sneakBar.open(msg, 'x', { duration: 2000 });}
  

}
