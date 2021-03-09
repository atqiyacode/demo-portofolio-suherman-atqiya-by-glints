import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCreateOpnameComponent } from './plan-create-opname.component';

describe('PlanCreateOpnameComponent', () => {
  let component: PlanCreateOpnameComponent;
  let fixture: ComponentFixture<PlanCreateOpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanCreateOpnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCreateOpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
