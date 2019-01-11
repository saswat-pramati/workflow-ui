import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualArrowComponent } from './virtual-arrow.component';

describe('VirtualArrowComponent', () => {
  let component: VirtualArrowComponent;
  let fixture: ComponentFixture<VirtualArrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualArrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
