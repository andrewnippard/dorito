import { Component, OnInit, OnDestroy } from '@angular/core';
import { NodeService } from '../node.service';
import { NodeResult } from '../node-result';
import { ActivatedRoute } from '@angular/router';

function parse_result(result) {
  let schemas = result.schemas.reduce((obj, item) => {
    obj[item.id] = item.columns
    return obj
  }, {});
 
  let ret_val = {};
  for (let table of result.data) {
    let schema_names = schemas[table.schema].map(x => x.name);
    let schema_types = schemas[table.schema].map(x => x.type);
    let data = table.values[0].map((col, i) => table.values.map(row => row[i]))
      .map(row => row.reduce((obj, item, i) => {
        obj[schema_names[i]] = item;
        return obj;
      }, {}));
    ret_val[table.name] = data;
  }
  return ret_val;
};

@Component({
  selector: 'app-noderesults',
  templateUrl: './noderesults.component.html',
  styleUrls: ['./noderesults.component.css']
})
export class NodeResultsComponent implements OnInit {

  id : number;
  sub : any;
  displayedColumns: string[] = ['ts', 'value'];
  nodeResults : NodeResult[] = [];

  constructor(private nodeService : NodeService, private route : ActivatedRoute ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.getNodeResults();
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getNodeResults() : void {
    this.nodeService.getNodeResults(this.id).subscribe(nodeResults => {
      this.nodeResults = nodeResults;
    });
  }

}
