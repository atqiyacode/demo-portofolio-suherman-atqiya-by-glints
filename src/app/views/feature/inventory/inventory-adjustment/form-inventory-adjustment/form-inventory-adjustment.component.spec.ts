import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInventoryAdjustmentComponent } from './form-inventory-adjustment.component';

describe('FormInventoryAdjustmentComponent', () => {
  let component: FormInventoryAdjustmentComponent;
  let fixture: ComponentFixture<FormInventoryAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInventoryAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInventoryAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
