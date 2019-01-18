import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import * as shape from 'd3-shape';
import { Subject } from 'rxjs';
import { colorSets } from './color-sets';
import { id } from './id';
import chartGroups from './chartTypes';
import { countries, getTurbineData } from './data';
import { NodeService } from '../node.service';
import { ActivatedRoute } from '@angular/router';
import { QueryParameterTextbox } from '../query-parameter/query-parameter-textbox';

let graph = {
  nodes: [    
    {
      id: '1000000',
      label: 'P'
    },
    {
      id: '1000001',
      label: 'T'
    },
    {
      id: '1000002',
      label: 'H'
    },
    {
      id: '1000003',
      label: 'view_H'
    }
  ],
  links: [
    {
      source: '1000000',
      target: '1000002',
      label: 'p'
    },
    {
      source: '1000001',
      target: '1000002',
      label: 't'
    },
    {
      source: '1000002',
      target: '1000003',
      label: 'h'
    },
  ]
};

@Component({
  selector: 'graphview',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./graphview.component.scss'],
  templateUrl: './graphview.component.html'
})
export class GraphviewComponent implements OnInit, OnDestroy {
  id : number;
  sub : any;
  queryPlan : any;
  query_parameters: any[];


  theme = 'dark';
  chartType = 'directed-graph';
  chartTypeGroups: any;
  chart: any;
  realTimeData: boolean = false;
  countrySet: any[];
  graph: { links: any[]; nodes: any[] };
  hierarchialGraph: { links: any[]; nodes: any[] };

  view: any[];
  width: number = 700;
  height: number = 300;
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
  orientation: string = 'BT'; // LR, RL, TB, BT

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

  constructor(private nodeService : NodeService, private route : ActivatedRoute ) {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getQueryPlan();

    Object.assign(this, {
      countrySet: countries,
      colorSchemes: colorSets,
      chartTypeGroups: chartGroups,
      hierarchialGraph: graph
    });
    this.setColorScheme('picnic');
    this.setInterpolationType('Bundle');
  }

  ngOnInit() {
    this.selectChart(this.chartType);
    setInterval(this.updateData.bind(this), 1000);
    if (!this.fitContainer) {
      this.applyDimensions();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getQueryPlan() {
    this.nodeService.getQueryPlan(this.id).subscribe(query_plan => {
      this.queryPlan = query_plan;
      this.query_parameters = this.queryPlan['query_parameters'].map(x => {
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
      console.log(this.query_parameters);
    });
  }
  
  updateData() {
    if (!this.realTimeData) {
      return;
    }

    const country = this.countrySet[Math.floor(Math.random() * this.countrySet.length)];
    const add = Math.random() < 0.7;
    const remove = Math.random() < 0.5;

    if (add) {
      // directed graph

      const hNode = {
        id: id(),
        label: country
      };

      this.hierarchialGraph.nodes.push(hNode);

      this.hierarchialGraph.links.push({
        source: this.hierarchialGraph.nodes[Math.floor(Math.random() * (this.hierarchialGraph.nodes.length - 1))].id,
        target: hNode.id,
        label: 'on success'
      });

      this.hierarchialGraph.links = [...this.hierarchialGraph.links];
      this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes];
    }
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
