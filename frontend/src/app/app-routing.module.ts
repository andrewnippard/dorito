import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NodesComponent } from './nodes/nodes.component';
import { NodeResultsComponent } from './noderesults/noderesults.component';
import { GraphviewComponent } from './graphview/graphview.component';
import { QueryparametersComponent } from './queryparameters/queryparameters.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'calc', component: NodesComponent },
  { path: 'graphview/:id', component: GraphviewComponent },
  { path: 'noderesults/:id', component: NodeResultsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
