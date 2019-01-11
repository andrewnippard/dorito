import { Component, OnInit, OnDestroy } from '@angular/core';
import { NodeService } from '../node.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-noderesults',
  templateUrl: './noderesults.component.html',
  styleUrls: ['./noderesults.component.css']
})
export class NodeResultsComponent implements OnInit {

  parse_result(result) {
    let schemas = result.schemas.reduce((obj, item) => {
      obj[item.id] = {
        index: item.index,
        columns: item.columns
      };
      return obj
    }, {});
    console.log('schemas:');
    console.log(schemas);

    let ret_val = {};
    for (let table of result.data) {
      let index_name = schemas[table.schema].index.name;
      let index_type = schemas[table.schema].index.type;
      let column_names = schemas[table.schema].columns.map(x => x.name);
      let column_types = schemas[table.schema].columns.map(x => x.type);
      let data = table.values[0].map((col, i) => table.values.map(row => row[i]))
        .map(row => row.reduce((obj, item, i) => {
          obj[column_names[i]] = item;
          return obj;
        }, {}));
      console.log(table.name + ':');
      console.log(data);
      ret_val[table.name] = data;
    }
    return ret_val;
  };

  id : number;
  sub : any;
  displayedColumns: string[] = ['ts', 'value'];
  nodeResults = {};

  showSpinner = true;
  showTable = false;
  spinnerColor = 'primary';
  spinnerMode = 'indeterminate';
  spinnerValue = 50;
  activeTableName = '';
  activeTableData = [];

  constructor(private nodeService : NodeService, private route : ActivatedRoute ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.getNodeResults();
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getNodeResults() : void {
      this.nodeService.getNodeResults(this.id).subscribe(nodeResults => {
        if (nodeResults['status'] >= 2) {
          this.nodeResults = nodeResults['result'];
          this.showSpinner = false;
          this.showTable = true;
          this.activeTableName = this.nodeResults['data'][0]['name'];
          this.activeTableData = this.parse_result(this.nodeResults)[this.activeTableName];
        }
        else {
          console.log('Check back in 250ms...');
          setTimeout(() => this.getNodeResults(), 250);
        }
      });
  }

  onSelect(table) {
    console.log(table.name);
    this.activeTableName = table.name;
    this.activeTableData = this.parse_result(this.nodeResults)[table.name];
    console.log(this.activeTableData);
  }

}
