import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-codepannel',
  templateUrl: './codepannel.component.html',
  styleUrls: ['./codepannel.component.css']
})
export class CodepannelComponent implements OnInit {

  @Input() json: any;

  sampleJson = JSON.stringify({
    'Id': 'AddWorkflow',
    'Version': 1,
    'DataType': 'MyApp.MyDataClass, MyApp',
    'Steps': [
      {
        'Id': 'Hello',
        'StepType': 'MyApp.HelloWorld, MyApp',
        'NextStepId': 'Add'
      },
    {
        'Id': 'Add',
        'StepType': 'MyApp.AddNumbers, MyApp',
        'NextStepId': 'Bye',
        'Inputs': {
            'Value1': 'data.Value1',
            'Value2': 'data.Value2'
         },
        'Outputs': {
            'Answer': 'step.Result'
        }
      },
      {
        'Id': 'Bye',
        'StepType': 'MyApp.GoodbyeWorld, MyApp'
      }
    ]
  }, null, 2);



  constructor() {

   }

  ngOnInit() {
    this.json = JSON.stringify(this.json, null, 2);
  }

}
