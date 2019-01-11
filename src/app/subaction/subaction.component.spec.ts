import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubactionComponent } from './subaction.component';

describe('SubactionComponent', () => {
  let component: SubactionComponent;
  let fixture: ComponentFixture<SubactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
