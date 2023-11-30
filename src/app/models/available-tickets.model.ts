export class AvailableTickets{

    public hour:number;

    constructor(public startTime:string, public availablePlaces:number, public isClosed:boolean){
        this.hour = parseInt(startTime.substring(0, startTime.indexOf(":")));
        
    }

    public canOrder(amount:number):boolean{
        return !this.isClosed 
                && this.availablePlaces>0 
                && amount >= this.availablePlaces
                // && startTime didn't pass yet 
                ;
    }

    public updateOrder(amount:number):string{
        this.availablePlaces -= amount;
        return `הזמנת כרטיסים ל${amount} אנשים לשעה ${this.startTime} נקלטה בהצלחה`;
    }
}