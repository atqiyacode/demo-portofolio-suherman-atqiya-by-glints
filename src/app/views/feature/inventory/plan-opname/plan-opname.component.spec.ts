import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanOpnameComponent } from './plan-opname.component';

describe('PlanOpnameComponent', () => {
  let component: PlanOpnameComponent;
  let fixture: ComponentFixture<PlanOpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanOpnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanOpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
