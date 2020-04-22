import { Component, Input, ElementRef, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as d3 from 'd3';
import { GraphDataService } from './graph-data.service';
interface chartDataType{
  baseValue: number,
  incomeDifference: number,
  name: string
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})


export class HeaderComponent implements OnChanges {

	@Input() data: chartDataType[] ;
	@Input() keys:string[];

	private w: number = 750;
	private h: number = 400;
	private margin = {top: 50, right: 50, bottom: 30, left: 100};
	private width = this.w - this.margin.left - this.margin.right;
	private height = this.h - this.margin.top - this.margin.bottom - 250;

	private x: any;
	private y: any;
	private svg: any;
	private g: any;
	public stack: any;
	private chart: any;
	private layersBarArea: any;
	private layersBar: any;
	private xAxis: any;
	private yAxis: any;
	private stackedSeries: any;
	private chartColorConstants={
	'baseColor': '#ededed',
	'profitColor': '#429e34',
	'lossColor': '#f45e5d'
	}

	constructor(private container: ElementRef, private graphService:GraphDataService){

	}

	ngOnInit() {
		this.stack = d3.stack().keys(this.keys);

		this.initScales();
		this.initSvg();
		this.createStack(this.data);
		this.drawAxis();
  	}
  
/* to detect the tab or button change, so that graph can be changed as per the desired data */
	ngOnChanges(changes: SimpleChanges) {
		const dataChange = changes.data;
		if(dataChange && dataChange.firstChange === false){
			this.stack = d3.stack().keys(this.keys)
      			this.createStack(this.data);
		}
	}
/* Drawing up the scales */
	public initScales(){
		this.x = d3.scaleBand()
      			.rangeRound([0, this.width])
      			.round(true)
			.padding(0.6);

		this.y = d3.scaleLinear()
			.range([this.height, 0])
	}

  /* To initiate the SVG placeholder */
	public initSvg() {
		this.svg = d3.select(this.container.nativeElement)
			.select('.chart-container')
			.append('svg')
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr('class', 'chart')
			.attr('width', this.w)
			.attr('height', this.h)
			.attr("viewBox", "0 0 600 400");

		this.chart = this.svg.append('g')
			.classed('chart-contents', true)
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.layersBarArea = this.chart.append('g')
			.classed('layers', true);
	}

  /* Drawing up the axes */
	public drawAxis(){
		this.xAxis = this.chart.append('g')
			.classed('x-axis', true)
			.attr("transform", "translate(0," + this.height + ")")
      			.call(d3.axisBottom(this.x).tickSize(0))
      
	    this.xAxis.selectAll("path")
	    .attr("stroke", "#d9d9d9");
	    this.xAxis.selectAll("text")
	    .style("stroke","#4d4d4d")
	    .style("font-size","14px")
	    .attr('y', '10');
		
  
   /* Since Y-axis is not required in our case, therefore it has been skipped */
      
	}

  /* Creating the data in stacked format to build up the stacked graph */
	public createStack(stackData:any){
		this.stackedSeries = this.stack(stackData);
        console.log(this.stackedSeries)
		this.drawChart(this.stackedSeries)
	}
/* Contains logic for drawing the graph */
	public drawChart(data:any){
	    if(this.layersBar){ //removing the earlier bar charts (if any)
	      this.layersBar.remove();
	    }

		this.layersBar = this.layersBarArea.selectAll('.layer')
			.data(data)
			.enter()
			.append('g')
			.classed('layer', true)
			.style('fill', this.chartColorConstants.baseColor);

		this.x.domain(this.data.map((d:any)=>{ //setting up the x-domain as per the data
			return d.name
    }));
    
    this.y.domain([0,150]); // keeping the constant value, will be changed with real data.
		// this.y.domain([0, +d3.max(this.stackedSeries, function(d:any){ //setting up the y-domain as per the data
		// 	return d3.max(d, (d:any)=>{
		// 		return d[1]
		// 	})
    //})]);
    
    

    let groups=this.layersBar.selectAll('rect')
    .data((d:any)=>{
      return d;
    })
    .enter()
    .append('g')
    .attr("class", "gbar");
    /* creating the bars */
    groups.append('rect')
    .attr('x', (d:any, i:any)=>{
      return this.x(d.data.name)
    })
    .attr('width', this.x.bandwidth())
    .attr("y",  d => { return this.y(75); })
    .attr("height", (d:any) => { return Math.abs(this.y(d[0]) - this.y(d[1])) })
    .transition()
    .duration(800)
    .ease(d3.easeExpInOut)
    .delay(function (d, i) { //delay function can be removed or commented if not required
        return i * 150;
    })
    .attr("y",  (d:any) => { 
      if(d[1] < d[0]){
        return this.y(d[0]);
      }else {
        return this.y(d[1]); 
      }
      })
    .attr("height",  (d:any) => { return Math.abs(this.y(d[0]) - this.y(d[1])) })
    
    .style('fill', (d:any, i:any)=>{ //filling the upper stack of graph as per the data
      if(d[0] > 0 &&  d[1]< d[0]){
        return this.chartColorConstants.lossColor;
      }else if(d[0] > 0 &&  d[1] > d[0]){
        return this.chartColorConstants.profitColor;
      }
    });
    // if(groups.data){
    //   console.log(groups.data);
    // }
    /* putting the profit or loss amount and styling it as per the profit/loss situation */
    groups.append("text")
      .attr("class", "bar")
      .attr("text-anchor", "middle")
      .attr("x", (d:any)=> { return this.x(d.data.name) +this.x.bandwidth()/2; })
      .attr("y", (d:any)=> { 
        if(d[0] > 0 && d[0] > d[1]){
          return (this.y(d[0]) - 10 );
        }else if(d[0] > 0 && d[0] < d[1]){
          return (this.y(d[1]) - 10 );
        }
      })
      .text( (d:any, i:any) =>{
        if(d[0] > 0 &&  d[1]< d[0]){
          return "-" + Number(d[0] - d[1]) + "€";
        }else if(d[0] > 0 &&  d[1] > d[0]){
          return "+" +Number(d[1] - d[0]) + "€";
        }else if(d[0] > 0 &&  d[1] == d[0]){
          return 0;
        }
      })
      .style("stroke", (d:any, i:any) =>{
        if(d[0] > 0 &&  d[1]< d[0]){
          return "red"
        }else if(d[0] > 0 &&  d[1] > d[0]){
          return "green"
        }else if(d[0] > 0 &&  d[1] == d[0]){
          return '#ededed'
        }
      });

      /* Appending the divider lines in x-axis, as per the VD */
      groups.append("line")
      .attr("x1", (d:any)=> { return this.x(d.data.name) +this.x.bandwidth()*1.7; })
      .attr('y1', this.y(-5))
      .attr("x2", (d:any)=> { return this.x(d.data.name) +this.x.bandwidth()*1.7; })
      .attr('y2', this.y(-60))
      .style("stroke" , "#e8e8ed")
      .style("stroke-width" , "1")


      /* this part is for the dotted divider in the graph as shown in the VD */
      let marker = this.layersBar.append('g')
      .classed("marker",true);
      marker.append('line')
      .attr('x1', 0)
      .attr('y1', this.y(75))  //TODO the value 75 has to be replaced with some constant coming in from data
      .attr('x2', this.width)
      .attr('y2', this.y(75))
      .style("stroke" , "#808080")
      .style("stroke-width" , "1")
      .style("stroke-dasharray" , "4 3")
      marker.append('line')
      .attr('x1', 0)
      .attr('y1', this.y(75))
      .attr('x2', 0)
      .attr('y2', this.y(135)) //TODO : it will change with respect to 75
      .style("stroke" , "#808080")
      .style("stroke-width" , "1")
      .style("stroke-dasharray" , "4 3")
      
      marker.append("circle")        
      .attr("cx", 0)           
      .attr("cy", this.y(135)) //TODO : it will change with respect to 75          
      .attr("r", 4)             
      .style("stroke", "#808080")    
      .style("fill", "none");

      marker.append("text")
      .attr("class", "lineValue")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", this.y(150)) //TODO : it will change with respect to 75
      .text("€ 75")
      .style("stroke", "#747474");

    
      

	}

}

