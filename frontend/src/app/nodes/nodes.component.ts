import { Component, OnInit } from '@angular/core';
import { Node } from '../node';
import { NodeService } from '../node.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rnodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  
  displayedColumns: string[] = ['id', 'url', 'description', 'description_verbose', 'qual_name', 'state', 'doc'];
  nodes : Node[] = [];

  constructor(private nodeService : NodeService, private router : Router) { }

  ngOnInit() {
    this.getNodes();
  }

  getNodes(): void {
    this.nodeService.getNodes()
      .subscribe(nodes => {
        if (nodes['results']) {
          this.nodes = nodes['results'];
        }
      })
  }

  onSelect(row : Node): void {
    console.log(row);
    // Run node and navigate to run id
    this.nodeService.runNode(row.id, {}).subscribe(node_run => {
      console.log('Going to ' + node_run['id']);
      this.router.navigate(['/noderesults', node_run['id']]);
    });
  }
}
