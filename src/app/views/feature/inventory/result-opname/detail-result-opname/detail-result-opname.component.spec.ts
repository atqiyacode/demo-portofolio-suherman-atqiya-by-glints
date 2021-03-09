import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailResultOpnameComponent } from './detail-result-opname.component';

describe('DetailResultOpnameComponent', () => {
  let component: DetailResultOpnameComponent;
  let fixture: ComponentFixture<DetailResultOpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailResultOpnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailResultOpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
