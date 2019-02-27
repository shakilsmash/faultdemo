import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FaultService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getFaults() {
    return this.http.get(`${this.uri}/faults`);
  }

  getFaultById(id) {
    return this.http.get(`${this.uri}/faults/${id}`);
  }

  addFault(startDateTime, endDateTime, duration, acknowledged, domain, subDomain, cause, action, keyword, completed) {
    const fault = {
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      duration: duration,
      acknowledged: acknowledged,
      domain: domain,
      subDomain: subDomain,
      cause: cause,
      action: action,
      keyword: keyword,
      completed: completed
    }
    console.log('in service'+startDateTime);
    return this.http.post(`${this.uri}/faults/add`, fault);
  }

  updateFault(id, startDateTime, endDateTime, duration, acknowledged, domain, subDomain, cause, action, keyword, completed) {
    const fault = {
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      duration: duration,
      acknowledged: acknowledged,
      domain: domain,
      subDomain: subDomain,
      cause: cause,
      action: action,
      keyword: keyword,
      completed: completed
    }
    return this.http.post(`${this.uri}/faults/update/${id}`, fault);
  }

  deleteFault(id) {
    return this.http.get(`${this.uri}/faults/delete/${id}`);
  }
}
