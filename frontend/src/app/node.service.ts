import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Node } from './node';
import { NodeResult } from './node-result';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  nodesUrl = 'http://localhost:8000/calc/api/v1/nodes';
  nodeResultsUrl = 'http://localhost:8000/calc/api/v1/noderesults/';

  constructor(private http : HttpClient) { }

  getNodes() {
    return this.http.get(this.nodesUrl);
  }

  getNodeResults(node_id : number) : Observable<NodeResult[]> {
    return this.http.get<NodeResult[]>(this.nodeResultsUrl + node_id);
  }
}
