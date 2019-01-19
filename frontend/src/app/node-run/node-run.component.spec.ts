import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeRunComponent } from './node-run.component';

describe('NodeRunComponent', () => {
  let component: NodeRunComponent;
  let fixture: ComponentFixture<NodeRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
