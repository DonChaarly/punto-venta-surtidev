import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtileriaService {

  constructor() { }


  dateFormate(date: Date): string{

    let year = `${date.getFullYear()}`;
    let month = `${date.getMonth() + 1}`;
    if(parseInt(month) < 10){
      month = "0" + month
    }
    let day = `${date.getDate() }`
    if(day.length == 1){
      day = "0" + day
    }

    return `${year}-${month}-${day}`;
  }


}
