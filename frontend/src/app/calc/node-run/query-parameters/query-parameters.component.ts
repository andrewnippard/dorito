import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { QueryParameterBase } from '../query-parameter/query-parameter-base';

@Component({
  selector: 'app-query-parameters',
  templateUrl: './query-parameters.component.html',
  styleUrls: ['./query-parameters.component.css']
})
export class QueryParametersComponent implements OnInit {
  @Output() onSubmit : EventEmitter<any> = new EventEmitter<any>();
  @Input() query_parameters : QueryParameterBase<any>[];
  @Input() form : FormGroup;

  constructor() { }

  ngOnInit() {
  }

  submit() {
    this.onSubmit.emit();
  }
}
