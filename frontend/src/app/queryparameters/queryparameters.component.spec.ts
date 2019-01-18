import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryparametersComponent } from './queryparameters.component';

describe('QueryparametersComponent', () => {
  let component: QueryparametersComponent;
  let fixture: ComponentFixture<QueryparametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryparametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryparametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
