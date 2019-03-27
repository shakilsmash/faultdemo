import { MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


import { FaultService } from '../../fault.service';
import { Fault } from '../../fault.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id: String;
  fault: any = {};
  updateForm: FormGroup;

  constructor(private faultService: FaultService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.updateForm = this.fb.group({
      domain: '',
      subDomain: '',
      cause: '',
      action: '',
      keyword: '',
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.faultService.getFaultById(this.id).subscribe(res => {
        this.fault = res;
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
      })
    });
  }

  updateFault(domain, subDomain, cause, keyword, action) {
   
    var acknowledged = true;
    var completed = true;

    this.faultService.updateFault(this.id, this.fault.startDateTime, this.fault.endDateTime, this.fault.duration, acknowledged, domain, subDomain, cause, action, keyword, completed).subscribe(() => {
      this.snackBar.open('Fault updated successfully...', 'OK', {
        duration: 3000
      });
      this.router.navigate(['/list']);
    });
  }
}
