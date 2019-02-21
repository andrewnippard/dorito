import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NodesComponent } from './nodes/nodes.component';
import { NodeRunComponent } from './node-run/node-run.component';
import { NodeResultsComponent } from './noderesults/noderesults.component';

const routes: Routes = [
  { path: '', component: NodesComponent },
  { path: 'noderun/:id', component: NodeRunComponent },
  { path: 'noderesults/:id', component: NodeResultsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalcRoutingModule { }