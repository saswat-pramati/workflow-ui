import { Component, OnInit } from '@angular/core';
import { EventServiceService } from './../services/event-service.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  savedOrSelectedWorkflowName = null;
  version: string = null;
  appName: string = null;

  constructor(private eventSerivce: EventServiceService) {
    this.version = environment.version;
    this.appName = environment.appName;
   }

  ngOnInit() {
    this.eventSerivce.workflowName.subscribe(name => this.savedOrSelectedWorkflowName = name );
  }

  clickRun() {
    this.eventSerivce.pushRunEvent();
  }

  clickSave() {
    this.eventSerivce.intimateSave(true);
  }


}
