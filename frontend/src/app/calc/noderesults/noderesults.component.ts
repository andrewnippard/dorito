import { Component, OnInit, OnDestroy } from '@angular/core';
import { NodeService } from '../node.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-noderesults',
  templateUrl: './noderesults.component.html',
  styleUrls: ['./noderesults.component.css']
})
export class NodeResultsComponent implements OnInit {
  
  id : number;
  sub : any;
  nodeResults = {};
  activeTable = {};
  showSpinner = true;
  showTable = false;
  spinnerColor = 'primary';
  spinnerMode = 'indeterminate';
  spinnerValue = 50;

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
          this.activeTable = this.loadTable();
          this.showTable = true;
        }
        else {
          console.log('Check back in 250ms...');
          setTimeout(() => this.getNodeResults(), 250);
        }
      });
  }

  onSelect(table) {
    console.log('Loading table ' + table.name);
    this.activeTable = this.loadTable(table.name);
  }

  loadTable(table_name?) {
    // If table not provided, load first table
        if (!table_name) {
            table_name = this.nodeResults['data'][0]['name'];
            console.log('Table not provided... Loading table ' + table_name + '.');
        }
    
        // Find table & related schema
        let table = this.nodeResults['data'].find(x => x['name'] === table_name);
        let schema = this.nodeResults['schemas'].find(x => x['id'] == table['schema']);
    
        // Populate return value with table name, column names
        let ret_val = {
            table_name: table_name,
            columns: [schema['index']['name'], ...schema['columns'].map(x => x['name'])],
            data: []
        };
        // Populate return value with data
        ret_val.data = table['index'].map((idx_val, i) => {
            return {
                [schema['index']['name']]: idx_val,
                ...schema['columns'].map((col, j) => {
                    return {
                        [col['name']]: table['values'][i][j]
                    };
                }).reduce((obj, item) => {
                    return {
                        ...obj,
                        ...item
                    };
                }, {})
            }
        });
        // Log result
        console.log('Result...');
        console.log(ret_val);
        // Return result
        return ret_val;

    }

}
