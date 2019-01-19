import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NodeService } from '../node.service';
import { QueryParameterTextbox } from '../query-parameter/query-parameter-textbox';
import { FormGroup, FormControl } from '@angular/forms';
import { QueryParameterBase } from '../query-parameter/query-parameter-base';


@Component({
  selector: 'app-node-run',
  templateUrl: './node-run.component.html',
  styleUrls: ['./node-run.component.css']
})
export class NodeRunComponent implements OnInit {

  id : number;
  sub : any;
  queryParameters : any;
  queryParametersForm : FormGroup;
  graph : any;
  query : any;
  
  constructor( private router : Router, private route : ActivatedRoute, private nodeService : NodeService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.getQueryPlan();
    });
  }

  getQueryPlan() {
    this.nodeService.getQueryPlan(this.id).subscribe(query_plan => {

      this.queryParameters = query_plan['query_parameters'].map(x => {
        let s = {
          'datetime': QueryParameterTextbox,
          'string': QueryParameterTextbox
        };

        let obj = new s[x['type']]({
          'name': x['name'],
          'type': 'string'
        });
        return obj;
      });
      this.queryParametersForm = this.toFormGroup(this.queryParameters);

      let g = query_plan['graph'];
      let g_retval = {};
      g_retval['nodes'] = g['nodes'].map(x => {
        return {
          id: x['id'].toString(),
          label: x['description'],
          qual_name: x['qual_name'],
          docs: x['doc']
        };
      });
      g_retval['links'] = g['edges'].map(x => {
        return {
          source: x['node_from'].toString(),
          target: x['node_to'].toString(),
          label: 'label'
        }
      });
      this.graph = g_retval;
    })
  }

  toFormGroup(query_parameters : QueryParameterBase<any>[]) {
    let group: any = {};
    query_parameters.forEach(query_parameter => {
      group[query_parameter.name] = new FormControl('');
    });
    return new FormGroup(group);
  }

  onSubmit() {
    this.query = this.queryParametersForm.value;
    this.runNode();
  }

  runNode() {
    console.log('running node with query ' + JSON.stringify(this.query));
    // Run node and navigate to run id
    this.nodeService.runNode(this.id, this.query).subscribe(node_run => {
      console.log(node_run);
      console.log('Going to ' + node_run['id']);
      this.router.navigate(['/noderesults', node_run['id']]);
    });
  }
}
