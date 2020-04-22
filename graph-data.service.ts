import { Injectable } from '@angular/core';

interface chartDataType{
  baseValue: number,
  incomeDifference: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
chartData1:chartDataType[]=[
  {
    baseValue: 75,
    incomeDifference: 25,
    name: "Product1"
  },
  {
    baseValue: 75,
    incomeDifference: -25,
    name: "Product2"
  },
  {
    baseValue: 75,
    incomeDifference: 30,
    name: "Product3"
  },
  {
    baseValue: 75,
    incomeDifference: -40,
    name: "Product4"
  }
]
chartData2:chartDataType[]=[
  {
    baseValue: 75,
    incomeDifference: -25,
    name: "Product1"
  },
  {
    baseValue: 75,
    incomeDifference: 50,
    name: "Product2"
  },
  {
    baseValue: 75,
    incomeDifference: -30,
    name: "Product3"
  },
  {
    baseValue: 75,
    incomeDifference: 10,
    name: "Product4"
  }
]
  constructor() { }

  getChartData = (dataType:number) =>{
    if(dataType ==1){
      return this.chartData1;
    }else{
      return this.chartData2;
    }
  }
}
