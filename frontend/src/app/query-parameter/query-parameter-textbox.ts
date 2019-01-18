import { QueryParameterBase } from './query-parameter-base';

export class QueryParameterTextbox extends QueryParameterBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}