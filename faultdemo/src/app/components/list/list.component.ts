import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Chart } from 'chart.js';

import { Fault } from '../../fault.model';
import { FaultService } from '../../fault.service';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  i:any = 0;
  chart:any = [];
  faults: Fault[];
  
  checkFault:  any = {};
  displayedColumns = ['startDateTime', 'endDateTime', 'duration', 'domain', 'subDomain', 'cause', 'action', 'actions'];

  constructor(private faultService: FaultService, private router: Router) { }

  ngOnInit() {
    // this.faultService.getFaults().subscribe((faults) => {
    //   console.log(faults);
    // });
    var pointTrack = new Array();
    this.fetchFaults();

    var timeFormat: any = 'DD/MM/YYYY hh:mm:ss a';
    var config = {
      type:    'line',
      data:    {
          // datasets: [
          //     {
          //         label: "BD Dates",
          //         data: [{
          //             x: "04/01/2014 11:20:01 AM", y: 1
          //         }, {
          //             x: "04/01/2014 11:30:01 AM", y: 1
          //         }],
          //         fill: false,
          //         borderColor: 'red'
          //     }
          // ]
      },
      options: {
          responsive: true,
          title:      {
              display: false,
              text:    "Fault Time Scale"
          },
          legend: {
            display: false,
          },
          scales:     {
              xAxes: [{
                  type: 'time',
                  time: {
                        unit: 'second',
                      
  //                  distribution: 'linear'
                    tooltipFormat: 'DD/MM/YYYY HH:mm:ss'
                  },
                  scaleLabel: {
                      display:     true,
                      labelString: 'Time'
                  },
                  ticks: {
                    //X-axes display control
                    
                    callback: function(dataLabel, index) {
                      return index % 30 === 0 ? dataLabel : null;
                    }
                  }
              }],
              yAxes: [{
                  display: false,
                  scaleLabel: {
                      display:     true,
                      labelString: 'value'
                  }
              }]
          },
          hover: {
              mode: 'nearest',
              intersect: true //true
          },
          tooltips: {
              //Following three lines are defaults
              // mode: 'nearest', //index
              // intersect: false,
              // mode: 'index',

              //Starts the custom thingy
              intersect: false,
              enabled: false,
              custom: function(tooltipModel) {
                  // Tooltip Element
                  var tooltipEl = document.getElementById('chartjs-tooltip');

                  // Create element on first render
                  if (!tooltipEl) {
                      tooltipEl = document.createElement('div');
                      tooltipEl.id = 'chartjs-tooltip';
                      tooltipEl.innerHTML = "<table></table>";
                      document.body.appendChild(tooltipEl);
                  }

                  // Hide if no tooltip
                  if (tooltipModel.opacity === 0) {
                      tooltipEl.style.opacity = '0';
                      return;
                  }

                  // Set caret Position
                  tooltipEl.classList.remove('above', 'below', 'no-transform');
                  if (tooltipModel.yAlign) {
                      tooltipEl.classList.add(tooltipModel.yAlign);
                  } else {
                      tooltipEl.classList.add('no-transform');
                  }

                  function getBody(bodyItem) {
                      return bodyItem.lines;
                  }

                  // Set Text
                  if (tooltipModel.body) {
                      var titleLines = tooltipModel.title || [];
                      var bodyLines = tooltipModel.body.map(getBody);
                      var start = true;
                      var innerHtml = ''
                      // titleLines.forEach(function(title) {
                      //         //pointTrack.push(title);
                      //         innerHtml +='<tr><td>Start:</td><td bgcolor="#bababa"> ' + title + ' GMD+8</td></tr>' + 
                      //                     '<tr><td>End:</td><td> 18:32:03 GMD+8</td></tr>' + 
                      //                     '<tr><td>Length:</td><td>00:05:45</td></tr>' + 
                      //                     '<tr><td>Keywords:</td><td>default key, motor failure, needs fixing</td></tr>'
                      //                 ;
                      //  });

                      var fetchedId = '';
                       bodyLines.forEach(function(body, i) {
                        var colors = tooltipModel.labelColors[i];
                        var style = 'background:' + colors.backgroundColor;
                        style += '; border-color:' + colors.borderColor;
                        style += '; border-width: 2px';
                        var span = '<span style="' + style + '"></span>';
                        var temp = '' + body;
                        fetchedId = temp.substring(0,23);
                        temp = temp.substring(24, temp.length);
                        innerHtml += '<tr><td>' + span + temp + '</td></tr>';
                    });
                      innerHtml = '<div><tbody onclick="updateValue('+fetchedId+')>' + innerHtml.substring(0,innerHtml.length-13) + '</td></tr>';
                      // for(var i = 0; i < pointTrack.length; i+=2) {
                      //   innerHtml +='<tr><td>Start:</td><td bgcolor="#bababa"> ' + pointTrack[i] + ' GMD+8</td></tr>' + 
                      //   '<tr><td>End:</td><td> '+ pointTrack[i+1] +' GMD+8</td></tr>' + 
                      //   '<tr><td>Length:</td><td>00:05:45</td></tr>' + 
                      //   '<tr><td>Keywords:</td><td>works, yay, best</td></tr>'
                      //   ; 
                      //   if(pointTrack.length > 2) {
                      //     pointTrack.pop();
                      //     //pointTrack.pop();
                      //   }
                      // }

                      innerHtml += '</tbody></div>';
                      var tableRoot = tooltipEl.querySelector('table');
                      tableRoot.innerHTML = innerHtml;
                  }

                  // `this` will be the overall tooltip
                  var position = this._chart.canvas.getBoundingClientRect();

                  // Display, position, and set styles for font
                  tooltipEl.style.opacity = '1';
                  tooltipEl.style.position = 'absolute';
                  tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                  tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                  tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                  tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                  tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                  tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                  tooltipEl.style.pointerEvents = 'none';
              }
          },
          onClick: function(event) {
            var showList = document.getElementById('showList');
            showList.style.display = 'block';


            // var tooltipEl = document.getElementById('showDiv');

            // Create element on first render
            // if (!showList) {
            //     showList = document.createElement('div');
            //     showList.id = 'showDiv';
            //     showList.innerHTML = "<h2>"+value+" HAHAHAHAHAHAHAHAH "+ label +"</h2>";
            //     document.body.appendChild(tooltipEl);
            // }
          }
      }
    }
    var ctx = document.getElementById("canvas").getContext("2d");
    this.chart = new Chart(ctx, config);
  }

  ngAfterViewInit() {
    //console.log("testtest " + this.faults.length);
      // this.faults.forEach(element => {
      //   //this.addData(element);
      //   console.log("test " + element.status);
      // });
  }

  updateValue(id) {
    console.log(id);
  }

  fetchFaults() {
    this.faultService
      .getFaults()
      .subscribe((data: Fault[]) => {
        this.faults = data;
        console.log('Data requested....');
        console.log(this.faults);
        this.faults.forEach(element => {
          this.addData(element);
        });
      });
  }

  editFault(id) {
    this.router.navigate([`/edit/${id}`]);
  }

  deleteFault(id) {
    this.faultService.deleteFault(id).subscribe(() => {
      this.fetchFaults();
    });
  }

  addData(newValue: Fault) {
    var color = "";
    var text = newValue._id + '<tr><td>Start: </td><td bgcolor="#bababa"> ' + newValue.startDateTime + ' GMD+8</td></tr>' + 
    '<tr><td>End: </td><td> '+ newValue.endDateTime +' GMD+8</td></tr>' + 
    '<tr><td>Length: </td><td>'+newValue.duration+'</td></tr>' + 
    '<tr><td>Keywords: </td><td>'+newValue.keyword+'</td></tr>'
;

    if(newValue.completed == "true") {
      color = 'blue';
    }
    else {
      color = 'red';
    }
    this.chart.data.datasets.push({
      //label: newValue._id,
      label: text,
      //backgroundColor: 'green',
      data: [{
          x: newValue.startDateTime, y: 1
      }, {
          x: newValue.endDateTime, y: 1
      }],
      borderColor: color,
      fill: false,
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
    });
    this.chart.update();
    }
    
    addDummyData(newValue) {
      this.chart.data.datasets.push({
        label: newValue.status,
        //backgroundColor: 'green',
        data: [{
          x: "04/01/2014 11:50:01 AM", y: 1
      }, {
          x: "04/01/2014 11:55:01 AM", y: 1
      }],
        borderColor: 'green',
        fill: false
      });
      this.chart.update();
      }
}
