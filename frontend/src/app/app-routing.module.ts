import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NodesComponent } from './nodes/nodes.component';
import { NodeResultsComponent } from './noderesults/noderesults.component';
import { GraphviewComponent } from './graphview/graphview.component';
import { NodeRunComponent } from './node-run/node-run.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'calc', component: NodesComponent },
  { path: 'noderun/:id', component: NodeRunComponent },
  { path: 'noderesults/:id', component: NodeResultsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
