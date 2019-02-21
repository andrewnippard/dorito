import { Injectable } from '@angular/core';

import { QueryParameterBase } from './query-parameter/query-parameter-base';
import { QueryParameterTextbox } from './query-parameter/query-parameter-textbox';

@Injectable()
export class QueryParameterService {

  // TODO: get from a remote source of question metadata
  // TODO: make asynchronous
  getQueryParameters() {

    let query_parameters: QueryParameterBase<any>[] = [
      new QueryParameterTextbox({
        name: 'start',
        type: 'datetime',
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1
      }),

      new QueryParameterTextbox({
        name: 'end',
        key: 'emailAddress',
        label: 'Email',
        type: 'datetime',
        order: 2
      })
    ];

    return query_parameters; //.sort((a, b) => a.order - b.order);
  }
}