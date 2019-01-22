import { Component, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChanges, Inject } from '@angular/core';
import * as shape from 'd3-shape';
import { Subject } from 'rxjs';
import { colorSets } from './color-sets';
import chartGroups from './chartTypes';
import { NodeService } from '../node.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Node } from '../node';
import { WebsocketService } from '../websocket.service';
import { NodeRunService } from '../noderun.service';

@Component({
  selector: 'graphview',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./graphview.component.scss'],
  templateUrl: './graphview.component.html',
  providers: [WebsocketService, NodeRunService]
})
export class GraphviewComponent implements OnInit, OnChanges {
  @Input() graph : any;

  theme = 'dark';
  chartType = 'directed-graph';
  chartTypeGroups: any;
  chart: any;
  realTimeData: boolean = false;
  countrySet: any[];

  hierarchialGraph: { links: any[]; nodes: any[] };

  view: any[];
  width: number = 1000;
  height: number = 600;
  fitContainer: boolean = true;
  autoZoom: boolean = false;
  panOnZoom: boolean = true;
  enableZoom: boolean = true;
  autoCenter: boolean = false;
  linkDataUI: boolean = false;

  // observables
  update$: Subject<any> = new Subject();
  center$: Subject<any> = new Subject();
  zoomToFit$: Subject<any> = new Subject();
  zoomToNode$: Subject<any> = new Subject();

  // options
  showLegend = false;
  orientation: string = 'BT';
  orientations: any[] = [
    {
      label: 'Left to Right',
      value: 'LR'
    },
    {
      label: 'Right to Left',
      value: 'RL'
    },
    {
      label: 'Top to Bottom',
      value: 'TB'
    },
    {
      label: 'Bottom to Top',
      value: 'BT'
    }
  ];

  // line interpolation
  curveType: string = 'Linear';
  curve: any = shape.curveLinear;
  interpolationTypes = [
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before'
  ];

  colorSchemes: any;
  colorScheme: any;
  schemeType: string = 'ordinal';
  selectedColorScheme: string;
  nodeIdForZoom: string;

  constructor(
    private nodeService : NodeService,
    public dialog: MatDialog,
    private nodeRunService: NodeRunService
  ) {
    Object.assign(this, {
      colorSchemes: colorSets,
      chartTypeGroups: chartGroups,
      hierarchialGraph: this.graph
    });
    this.setColorScheme('picnic');
    this.setInterpolationType('Bundle');
    nodeRunService.node_run_id = 89;
    nodeRunService.messages.subscribe(msg => {
      console.log("Response from websocket: " + msg);
    });
  }

  ngOnInit() {
    this.selectChart(this.chartType);
    if (!this.fitContainer) {
      this.applyDimensions();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.graph.currentValue);
    this.hierarchialGraph = changes.graph.currentValue;
  }

  applyDimensions() {
    this.view = [this.width, this.height];
  }

  toggleEnableZoom(enableZoom: boolean) {
    this.enableZoom = enableZoom;
  }

  toggleFitContainer(fitContainer: boolean, autoZoom: boolean, autoCenter: boolean): void {
    this.fitContainer = fitContainer;
    this.autoZoom = autoZoom;
    this.autoCenter = autoCenter;

    if (this.fitContainer) {
      this.view = undefined;
    } else {
      this.applyDimensions();
    }
  }

  showlinkDataUI(): void {
    this.updateChart();
  }

  selectChart(chartSelector) {
    this.chartType = chartSelector;

    for (const group of this.chartTypeGroups) {
      for (const chart of group.charts) {
        if (chart.selector === chartSelector) {
          this.chart = chart;
          return;
        }
      }
    }
  }

  select(data) {
    console.log('Item clicked', data);
    const dialogRef = this.dialog.open(NodeDialog, {
      width: '650px',
      data: data,
      panelClass: "formFieldWidth480"
    });
  }

  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = this.colorSchemes.find(s => s.name === name);
  }

  setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = shape.curveStepBefore;
    }
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  toggleExpand(node) {
    console.log('toggle expand', node);
  }

  updateChart() {
    this.update$.next(true);
  }

  zoomToFit() {
    this.zoomToFit$.next(true);
  }

  zoomToNode(nodeId: string) {
    this.zoomToNode$.next(nodeId);
  }

  center() {
    this.center$.next(true);
  }

  onZoom(zoomLevel: number) {
    console.log('Zoom level:', zoomLevel);
  }
}

@Component({
  selector: 'node-dialog',
  templateUrl: 'node-dialog.html',
})
export class NodeDialog {

  constructor(
    public dialogRef: MatDialogRef<NodeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Node) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}