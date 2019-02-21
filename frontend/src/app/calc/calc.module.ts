import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

import { NodesComponent } from './nodes/nodes.component';
import { NodeRunComponent } from './node-run/node-run.component';
import { GraphviewComponent } from './node-run/graphview/graphview.component';
import { QueryParameterComponent } from './node-run/query-parameter/query-parameter.component';
import { QueryParametersComponent } from './node-run/query-parameters/query-parameters.component';
import { NodeResultsComponent } from './noderesults/noderesults.component';
import { NodeDialog } from './node-run/graphview/graphview.component';

import { NodeService } from './node.service';

import { CalcRoutingModule } from './calc-routing.module';

@NgModule({
  declarations: [
    NodesComponent,
    NodeRunComponent,
    NodeResultsComponent,
    GraphviewComponent,
    QueryParameterComponent,
    QueryParametersComponent,
    NodeDialog
  ],
  imports: [
    CommonModule,
    CalcRoutingModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HttpClientModule,
    NgxChartsModule,
    NgxGraphModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  exports: [
    NodesComponent,
    NodeRunComponent,
    NodeResultsComponent
  ],
  providers: [
    NodeService
  ],
  entryComponents: [
    NodeDialog
  ]
})
export class CalcModule { }
