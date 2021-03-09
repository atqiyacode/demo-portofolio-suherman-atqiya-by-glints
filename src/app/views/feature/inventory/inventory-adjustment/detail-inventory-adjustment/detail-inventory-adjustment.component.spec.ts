import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInventoryAdjustmentComponent } from './detail-inventory-adjustment.component';

describe('DetailInventoryAdjustmentComponent', () => {
  let component: DetailInventoryAdjustmentComponent;
  let fixture: ComponentFixture<DetailInventoryAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailInventoryAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailInventoryAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
