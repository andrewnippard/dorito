import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QueryParameterBase } from './query-parameter/query-parameter-base';

@Injectable()
export class QueryParameterControlService {
  constructor() { }

  toFormGroup(query_parameters : QueryParameterBase<any>[]) {
    let group: any = {};
    query_parameters.forEach(query_parameter => {
      group[query_parameter.name] = new FormControl('');
    });
    return new FormGroup(group);
  }
}