import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { QueryParameterBase } from '../query-parameter/query-parameter-base';
import { QueryParameterControlService } from '../query-parameter-control.service';

@Component({
  selector: 'app-queryparameters',
  templateUrl: './queryparameters.component.html',
  styleUrls: ['./queryparameters.component.css'],
  providers: [QueryParameterControlService]
})
export class QueryparametersComponent implements OnInit, OnChanges {

  queryPlan : object;

  @Input() query_parameters : QueryParameterBase<any>[] = [];
  form : FormGroup;
  payLoad = '';

  constructor( private qpcs : QueryParameterControlService ) { }

  ngOnInit() {
    console.log('Updating form...');
    this.form = this.qpcs.toFormGroup(this.query_parameters);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Updating form...');
    this.form = this.qpcs.toFormGroup(changes.query_parameters.currentValue);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}
