import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultOpnameComponent } from './result-opname.component';

describe('ResultOpnameComponent', () => {
  let component: ResultOpnameComponent;
  let fixture: ComponentFixture<ResultOpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultOpnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultOpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
