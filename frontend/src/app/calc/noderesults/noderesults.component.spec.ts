import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeResultsComponent } from './noderesults.component';

describe('NodeResultsComponent', () => {
  let component: NodeResultsComponent;
  let fixture: ComponentFixture<NodeResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
