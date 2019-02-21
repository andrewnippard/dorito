import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QueryParameterBase } from './query-parameter-base'; 

@Component({
  selector: 'app-query-parameter',
  templateUrl: './query-parameter.component.html',
  styleUrls: ['./query-parameter.component.css']
})
export class QueryParameterComponent {
  @Input() query_parameter : QueryParameterBase<any>;
  @Input() form : FormGroup;
  get isValid() { return this.form.controls[this.query_parameter.name].valid; }
}
