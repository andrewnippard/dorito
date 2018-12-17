import { Component, OnInit, OnDestroy } from '@angular/core';
import { Node } from '../node';
import { NodeService } from '../node.service';
import { NodeResult } from '../node-result';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-noderesults',
  templateUrl: './noderesults.component.html',
  styleUrls: ['./noderesults.component.css']
})
export class NoderesultsComponent implements OnInit {

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
