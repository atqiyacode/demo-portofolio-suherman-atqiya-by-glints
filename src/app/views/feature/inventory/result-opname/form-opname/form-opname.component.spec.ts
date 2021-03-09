import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOpnameComponent } from './form-opname.component';

describe('FormOpnameComponent', () => {
  let component: FormOpnameComponent;
  let fixture: ComponentFixture<FormOpnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormOpnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOpnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
