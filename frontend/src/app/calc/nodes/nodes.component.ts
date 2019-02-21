import { Component, OnInit } from '@angular/core';
import { Node } from '../node';
import { NodeService } from '../node.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {
  
  displayedColumns: string[] = ['id', 'url', 'description', 'description_verbose', 'qual_name', 'state', 'doc'];
  nodes : Node[] = [];

  constructor( private nodeService : NodeService, private router : Router ) { }

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
    this.router.navigate(['/calc/noderun', row.id]);
  }
  
}
