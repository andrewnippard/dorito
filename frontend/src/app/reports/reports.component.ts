import { Component, OnInit } from '@angular/core';
import { Node } from '../node';
import { NodeService } from '../node.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  
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
    this.router.navigate(['/noderesults', row.id]);
  }

}
