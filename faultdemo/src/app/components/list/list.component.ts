import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Chart } from 'chart.js';
import { Moment } from 'moment';
import { Fault } from '../../fault.model';
import { FaultService } from '../../fault.service';
import { text } from '@angular/core/src/render3';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  selected = '60';
  i:any = 0;
  id: String;
  stepSize:any;
  chart:any = [];
  fault: any = {};
  faultInfo: any = {};
  faultShowInfo: Fault[] = [];
  faults: Fault[];
  createForm: FormGroup;
  updateForm: FormGroup;
  checkFault:  any = {};
  displayedColumns = ['startDateTime', 'endDateTime', 'duration', 'domain', 'subDomain', 'cause', 'action'];

  constructor(private snackBar: MatSnackBar, private faultService: FaultService, private router: Router, private fb: FormBuilder) {
    this.createForm = this.fb.group({
        interval: '',
        startDate: ['', Validators.required],
        startTime: '',
        endDate: ['', Validators.required],
        endTime: '',
        domain: '',
        subDomain: '',
        cause: '',
        action: '',
    })
    this.updateForm = this.fb.group({
      domain: '',
      subDomain: '',
      cause: '',
      action: '',
      keyword: '',
    });
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
          onClick: (event) => {
            // var showList = document.getElementById('showList');
            // showList.style.display = 'block';
            this.faultShowInfo = [];
            var activePoint = this.chart.getElementAtEvent(event);
            console.log(activePoint);
            var id = "";
            if(activePoint[0]){
              id = ""+this.chart.legend.legendItems[activePoint[0]._datasetIndex].text;
              id = id.substring(0,24);
              this.id = id;
              //this.editFault(id);
              
              this.faultService.getFaultById(this.id).subscribe(res => {
                this.faultInfo = res;
              });
              
              this.faultService.getFaults()
                .subscribe((data: Fault[]) => {
                  var count = 0;
                  this.faultShowInfo = data;
                  for (let index = 0; index < this.faultShowInfo.length; index++) {
                    var str = ''+this.id;
                      if(this.faultShowInfo[index]._id.localeCompare(str)!==0) {
                      console.log("removing: " + this.faultShowInfo[index]._id);
                      this.faultShowInfo.splice(index, 1);
                      index--;
                    }
                    
                  }
                });
              if(this.faultInfo.completed == 'false' || !this.faultInfo.completed) {
                this.createHTML();
                var showList = document.getElementById('showList');
                showList.style.display = 'none';
              }
              else {
                console.log("eta processed " + this.id);
                var showList = document.getElementById('updateList');
                showList.style.display = 'none';
                var showList = document.getElementById('showList');
                showList.style.display = 'block';
              }
            }
            
      }
    }
    });
  }

  createHTML() {
      var showList = document.getElementById('updateList');
      showList.style.display = 'block';
  }

  updateFault(domain, subDomain, cause, keyword, action) {
    var acknowledged = true;
    var completed = true;
    // console.log(domain);
    // console.log(subDomain);
    // console.log(cause);
    // console.log(keyword);
    // console.log(action);
    // console.log(this.id);
    this.faultService.getFaultById(this.id).subscribe(res => {
      this.fault = res;
      // if(keyword.length == 0) {
      //   keyword = this.fault.keyword;
      // }
      this.updateForm.get('startDateTime').setValue(this.fault.startDateTime);
      this.updateForm.get('endDateTime').setValue(this.fault.endDateTime);
      this.updateForm.get('duration').setValue(this.fault.duration);
      //this.updateForm.get('acknowledged').setValue(this.fault.acknowledged);
      this.updateForm.get('domain').setValue(this.fault.domain);
      this.updateForm.get('subDomain').setValue(this.fault.subDomain);
      this.updateForm.get('cause').setValue(this.fault.cause);
      this.updateForm.get('action').setValue(this.fault.action);
      this.updateForm.get('keyword').setValue(this.fault.keyword);
      //this.updateForm.get('completed').setValue(this.fault.completed);
    });
     this.faultService.updateFault(this.id, acknowledged, domain, subDomain, cause, action, keyword, completed).subscribe(() => {
       this.snackBar.open('Fault updated successfully...', 'OK', {
         duration: 3000
       });
        //this.router.navigate(['/list']);
        document.location.reload(true);
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
  showCreateForm() {
    var showList = document.getElementById('showList');
    showList.style.display = 'block';
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

  }

  addData(newValue: Fault) {
    var color = "";
    var keywords:string [] = newValue.keyword.split(',')
    var makeString = '';
    for (let index = 0; index < keywords.length; index++) {
      makeString += "<span class='badge badge-pill badge-light'>"+keywords[index]+"  </span>"
      
    }
    var text = newValue._id + '<tr><td style="text-align:right;">Start: </td><td class="badge badge-pill badge-light"><span class="glyphicon glyphicon-time"></span> ' + newValue.startDateTime + ' GMT+8</td></tr>' + 
    //var text = '<tr><td>Start: </td><td bgcolor="#bababa"> ' + newValue.startDateTime + ' GMD+8</td></tr>' + 
    '<tr><td style="text-align:right;">End: </td><td class="badge badge-pill badge-light"> '+ newValue.endDateTime +' GMT+8</td></tr>' + 
    '<tr><td style="text-align:right;">Length: </td><td class="badge badge-pill badge-light">'+newValue.duration+'</td></tr>' + 
    '<tr><td style="text-align:right;">Keywords: </td><td>'+makeString+'</td></tr>';
    // '<tr><td>Keywords: </td><td><span class="badge badge-pill badge-light">'+newValue.keyword+'</span></td></tr>';

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
