import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEditOpnameComponent } from './plan-edit-opname.component';

describe('PlanEditOpnameComponent', () => {
  let component: PlanEditOpnameComponent;
  let fixture: ComponentFixture<PlanEditOpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanEditOpnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanEditOpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
