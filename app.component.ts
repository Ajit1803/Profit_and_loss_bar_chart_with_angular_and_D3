import { Component, ViewChild, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import * as d3 from 'd3';
import { GraphDataService } from './graph-data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  Data:any;
  keys:any;

  @ViewChild(HeaderComponent) private graphModule : HeaderComponent;

  constructor(private graphService:GraphDataService) {}
  
  ngOnInit() {
    this.Data = this.graphService.getChartData(1);
    this.keys=[Object.keys(this.Data[0])[0], Object.keys(this.Data[0])[1]]
  }
  
  showGraph(val:Number){
    if(val ===1){
      this.Data= this.graphService.getChartData(1);
      this.keys=[Object.keys(this.Data[0])[0], Object.keys(this.Data[0])[1]];
    } else{
      this.Data= this.graphService.getChartData(2);
      this.keys=[Object.keys(this.Data[0])[0], Object.keys(this.Data[0])[1]];
    }
  }
}
