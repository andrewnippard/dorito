import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoderesultsComponent } from './noderesults.component';

describe('NoderesultsComponent', () => {
  let component: NoderesultsComponent;
  let fixture: ComponentFixture<NoderesultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoderesultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoderesultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
