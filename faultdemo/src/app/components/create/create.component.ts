import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FaultService } from '../../fault.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  private config = { hour: 7, minute: 15, meriden: 'PM', format: 12 };
  createForm: FormGroup;

  constructor(private faultService: FaultService, private fb: FormBuilder, private router: Router) {
    this.createForm = this.fb.group({
      startDate: ['', Validators.required],
      startTime: '',
      endDate: ['', Validators.required],
      endTime: '',
      //duration: '',
      //acknowledged: '',
      domain: '',
      subDomain: '',
      cause: '',
      action: '',
      //keyword: '',
      //completed: ''
    });
  }
  
  addFault(startDate, startTime, endDate, endTime, domain, subDomain, cause, action) {


      var timeStart = new Date(startDate + " " + startTime);
      var timeEnd = new Date(endDate + " " + endTime);

      var dateSplit = startDate.split('-');
      var year = dateSplit[0];
      var month = dateSplit[1];
      var day = dateSplit[2];
      var startDateTime = month + '/' + day + '/' + year + ' ';

      var dateSplit = endDate.split('-');
      var year = dateSplit[0];
      var month = dateSplit[1];
      var day = dateSplit[2];

      var endDateTime = month + '/' + day + '/' + year + ' ';
      
      var timeSplit = startTime.split(':');
      var hours = timeSplit[0];
      var minutes = timeSplit[1];
      var seconds = timeSplit[2];
      if(!seconds) {
        seconds = 0;
      }

      if(hours > 12) {
        hours -= 12;
        startDateTime += hours + ':' + minutes + ':' + seconds + ' PM'
      }
      else if(hours < 12) {
        startDateTime += hours + ':' + minutes + ':' + seconds + ' AM'
      }
      else {
        startDateTime += '12' + ':' + minutes + ':' + seconds + ' PM'
      }

      var timeSplit = endTime.split(':');
      var hours = timeSplit[0];
      var minutes = timeSplit[1];
      var seconds = timeSplit[2];
      if(!seconds) {
        seconds = 0;
      }

      if(hours > 12) {
        hours -= 12;
        endDateTime += hours + ':' + minutes + ':' + seconds + ' PM'
      }
      else if(hours < 12) {
        endDateTime += hours + ':' + minutes + ':' + seconds + ' AM'
      }
      else {
        endDateTime += '12' + ':' + minutes + ':' + seconds + ' PM'
      }
      
      var dt1 = new Date(startDateTime);
      var dt2 = new Date(endDateTime);
      var diff =(dt2.getTime() - dt1.getTime()) / 1000;

      var hrDiff = Math.floor(diff/(60*60));
      var minDiff = Math.floor((diff - (hrDiff*60*60))/60);
      var secDiff = (diff - (minDiff*60))%3600;
      var duration = ''

      if(hrDiff == 0) {
        duration = '';
      }
      else if(hrDiff < 10) {
        duration += '0'+hrDiff+":";
      }
      else {
        duration += hrDiff+":";
      }
      if(hrDiff == 0 && minDiff == 0) {
        duration = '';
      }
      else if(minDiff < 10) {
        duration += '0'+minDiff+":";
      }
      else {
        duration += minDiff+":";
      }
      if(secDiff < 10) {
        duration += '0'+secDiff;
      }
      else {
        duration += secDiff;
      }

      console.log(duration);
      //var duration = hrDiff + ":" + minDiff + ":" + secDiff;
      var acknowledged = false;
      var keyword = "fault, rotor error, motor failure";
      var completed = false;

    this.faultService.addFault(startDateTime, endDateTime, duration, acknowledged
      , domain, subDomain, cause, action, keyword, completed).subscribe(() => {
      this.router.navigate(['/list']);
      console.log(startDateTime);
    });
  }

  ngOnInit() {
  }

}
