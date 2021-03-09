import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailOpnameComponent } from './plan-detail-opname.component';

describe('PlanDetailOpnameComponent', () => {
  let component: PlanDetailOpnameComponent;
  let fixture: ComponentFixture<PlanDetailOpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDetailOpnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDetailOpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
