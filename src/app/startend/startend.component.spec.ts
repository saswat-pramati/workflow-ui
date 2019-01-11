import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartendComponent } from './startend.component';

describe('StartendComponent', () => {
  let component: StartendComponent;
  let fixture: ComponentFixture<StartendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
