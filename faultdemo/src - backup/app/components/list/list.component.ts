import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Chart } from 'chart.js';
import { Moment } from 'moment';
import { Fault } from '../../fault.model';
import { FaultService } from '../../fault.service';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  selected = '60';
  i:any = 0;
  stepSize:any;
  chart:any = [];
  faults: Fault[];
  createForm: FormGroup;
  checkFault:  any = {};
  displayedColumns = ['startDateTime', 'endDateTime', 'duration', 'domain', 'subDomain', 'cause', 'action', 'actions'];

  constructor(private faultService: FaultService, private router: Router, private fb: FormBuilder) {
    this.createForm = this.fb.group({
        interval: ''
    })
  }

  ngOnInit() {
    var pointTrack = new Array();
    this.fetchFaults();
    var fetchedId = '';
    var timeFormat: any = 'DD/MM/YYYY hh:mm:ss a';
    var config = {
      type:    'line',
      data:    {
      },
      options: {
          layout: {
              padding: {
                  left: 50
              } 
          },
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
                    unit: 'minute',
                    unitStepSize: '60',
                    distribution: 'linear',
                    tooltipFormat: 'DD/MM/YYYY HH:mm:ss',
                  },
                  scaleLabel: {
                      display:     true,
                      labelString: 'Time'
                  },
                  ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90
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
                      innerHtml = '<div><tbody>' + innerHtml.substring(0,innerHtml.length-13) + '</td></tr>';

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
          }
      }
    }
    //var ctx = document.getElementById("canvas").getContext("2d");
    //this.chart = new Chart(ctx, config);
    this.chart = new Chart("canvas", {
      type:    'line',
      data:    {
      },
      options: {
          layout: {
              padding: {
                  left: 50
              } 
          },
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
                    tooltipFormat: 'DD/MM/YYYY HH:mm:ss',
                  },
                  scaleLabel: {
                      display:     true,
                      labelString: 'Time'
                  },
                  ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90
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
                      innerHtml = '<div><tbody>' + innerHtml.substring(0,innerHtml.length-13) + '</td></tr>';

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
                  //tooltipEl.style.pointerEvents = 'none';
              }
          },
          onClick: function(event) {
            var showList = document.getElementById('showList');
            showList.style.display = 'block';
            var activePoint = this.chart.getElementAtEvent(event);
            //var activePoint = this.chart.getElementsAtEventForMode(event, 'point', this.chart.options);
            console.log(activePoint);
            if(activePoint[0]){
              //var id = ""+this.chart.legend.legendItems[activePoint[0]._index].text;
              var id = ""+this.chart.legend.legendItems[activePoint[0]._datasetIndex].text;
              id = id.substring(0,24)

                console.log(id);
            }
      }
    }
    });
  }

  changeInterval(interval) {
    var minTime = new Date ('01/01/2050 12:00:00 PM');
      this.stepSize = interval;
      console.log("Form: " + interval);
      console.log("Step: " + this.stepSize);
      //this.chart.options.scales.xAxes.time.unitStepSize = interval;
      this.chart.options.scales.xAxes[0].time.unit = 'minute';
      this.chart.options.scales.xAxes[0].time.unitStepSize = interval;
      this.faults.forEach(element => {
        var currentDate = new Date(element.startDateTime.toString());
        if(currentDate < minTime) {
          minTime = currentDate;
          console.log("Date changed to " + minTime);
        }
      });
      var coeff = 1000 * 60 * 5;
      var date = new Date();  //or use any other date
      var ampmSetter = minTime.getHours();
      var ampm = '';
      if(ampmSetter > 12) {
        ampm = 'PM';
      }
      else {
        ampm = 'AM';
      }
      var something = Math.floor(minTime.getHours());
      //console.log(something);
      //var rounded = new Date(Math.round(something / coeff) * coeff)

      var setMinDate = minTime.getMonth()+1 +'/'+ minTime.getDate() + '/'+ minTime.getFullYear() + ' ' + something+':00:00 '+ ampm;
      //var setMaxDate = maxTime.getMonth()+1 +'/'+ maxTime.getDate() + '/'+ maxTime.getFullYear() + ' ' + something+':00:00 '+ ampm;
      console.log(setMinDate);
      //this.chart.options.scales.xAxes[0].time.min = '02/27/2019 1:00:00 AM';
      this.chart.options.scales.xAxes[0].time.min = setMinDate;
      //this.chart.options.scales.xAxes[0].time.max = setMaxDate;
      this.chart.update();
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
        this.changeInterval(60);
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

  ngAfterViewInit() {
    //console.log("testtest " + this.faults.length);
      // this.faults.forEach(element => {
      //   //this.addData(element);
      //   console.log("test " + element.status);
      // });
  }

  addData(newValue: Fault) {
    var color = "";
    var text = newValue._id + '<tr><td>Start: </td><td bgcolor="#bababa"> ' + newValue.startDateTime + ' GMT+8</td></tr>' + 
    //var text = '<tr><td>Start: </td><td bgcolor="#bababa"> ' + newValue.startDateTime + ' GMD+8</td></tr>' + 
    '<tr><td>End: </td><td> '+ newValue.endDateTime +' GMT+8</td></tr>' + 
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
