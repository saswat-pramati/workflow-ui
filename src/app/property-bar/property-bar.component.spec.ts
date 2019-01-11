import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBarComponent } from './property-bar.component';

describe('PropertyBarComponent', () => {
  let component: PropertyBarComponent;
  let fixture: ComponentFixture<PropertyBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
