import { Component, OnInit, Input, TemplateRef, AfterViewInit, OnChanges, Output } from '@angular/core';
import { IDataModel } from './../model/dataModel';
import { ApiClientService } from '../apiclient/api-client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-property-bar',
  templateUrl: './property-bar.component.html',
  styleUrls: ['./property-bar.component.css']
})
export class PropertyBarComponent implements OnInit, AfterViewInit, OnChanges {



  @Input() data: IDataModel;
  inputCheck = false;
  outputCheck = false;
  steptypes: any;
  parameters: { inputs: string[], outputs: string[]} = { inputs: [], outputs: []};
  inputoutputParam: { key: string, value: string} = { key: '', value: ''};
  public modalRef: BsModalRef;
  isTextInpput = false;

  constructor(private apiClient: ApiClientService,  private modalService: BsModalService) { }

  ngOnInit() {
    this.steptypes = this.apiClient.getStepTypes().subscribe(res => {
      this.steptypes = res;
    }, err => console.log(err));

    this.apiClient.getParamaters().subscribe(res => {
      this.parameters.inputs = res.Input;
      this.parameters.outputs = res.Output;
    }, err => console.log(err));
  }

  ngAfterViewInit(): void {
    this.inputCheck = this.data ? this.data.data.Inputs ? true : false : false;
  }

  ngOnChanges(changes: any): void {
    if (changes.data.currentValue !== changes.data.previousValue) {
      this.inputCheck = this.data ? this.data.data.Inputs ? true : false : false;
    }
    if (changes.data.currentValue !== changes.data.previousValue) {
      this.outputCheck = this.data ? this.data.data.Outputs ? true : false : false;
    }
  }

  onStepTypeChange(stepType: any) {
    this.data.data.StepType = stepType + ', ' + 'WorkflowCore';
  }

  parseStepType(val: string) {
    return val.split(',')[0];
  }

  onInputCheckedChange(val: any) {
    this.inputCheck = val;
    if (!this.inputCheck) {
      delete this.data.data.Inputs;
    }
  }

  onOutputCheckedChange(val: any) {
    this.outputCheck = val;
    if (!this.outputCheck) {
      delete this.data.data.Outputs;
    }
  }

  onTextCheckChanged(isChecked: boolean) {
    this.isTextInpput = isChecked;
  }

  addOutput() {
    this.data.data.Outputs['Value2'] = 'step.Result';
  }

  deleteInputKey(key: string) {
    delete this.data.data.Inputs[key];
    if (Object.keys(this.data.data.Inputs).length === 0) {
      this.onInputCheckedChange(false);
    }
  }

  deleteOutputKey(key: string) {
    delete this.data.data.Outputs[key];
    if (Object.keys(this.data.data.Outputs).length === 0) {
      this.onOutputCheckedChange(false);
    }
  }


  openInputModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  addInputParam() {
    if (this.inputoutputParam.key && this.inputoutputParam.value) {
      if (this.validateParamaters(this.inputoutputParam)) {
        if (!this.data.data.Inputs) {
          this.data.data['Inputs'] = {};
        }
        this.data.data.Inputs[this.inputoutputParam.key] = this.isTextInpput ?
          this.inputoutputParam.value : 'data.' + this.inputoutputParam.value;
        this.inputoutputParam = { key: '', value: ''};
        this.modalRef.hide();
      } else {
        alert(this.inputoutputParam.key + ' or ' + this.inputoutputParam.value + ' already used!');
      }
    }
  }

  addOutputParam() {
    if (this.inputoutputParam.key && this.inputoutputParam.value) {
      if (this.validateParamaters(this.inputoutputParam)) {
        if (!this.data.data.Outputs) {
          this.data.data['Outputs'] = {};
        }
        this.data.data.Outputs[this.inputoutputParam.key] = this.isTextInpput ?
           this.inputoutputParam.value : 'step.' + this.inputoutputParam.value;
        this.inputoutputParam = { key: '', value: ''};
        this.modalRef.hide();
      } else {
        alert(this.inputoutputParam.key + ' or ' + this.inputoutputParam.value + ' already used!');
      }
    }
  }

  checkIfInputOutputEmpty(obj: any): boolean {
    return obj ? Object.keys(obj).length > 0 : false;
  }

  validateParamaters(newParam: any): boolean {
    const keyValueArr = new Set();
    if (this.data.data.Inputs) {
      Object.keys(this.data.data.Inputs).forEach((key) => {
        keyValueArr.add(key);
        keyValueArr.add(this.data.data.Inputs[key]);
      });

    } else if (this.data.data.Outputs) {
      Object.keys(this.data.data.Outputs).forEach((key) => {
        keyValueArr.add(key);
        keyValueArr.add(this.data.data.Outputs[key]);
      });
    }

    return !(keyValueArr.has(newParam.key) || keyValueArr.has(newParam.value));

  }

}
