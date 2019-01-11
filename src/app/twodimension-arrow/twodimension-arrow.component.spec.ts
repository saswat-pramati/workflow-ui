import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwodimensionArrowComponent } from './twodimension-arrow.component';

describe('TwodimensionArrowComponent', () => {
  let component: TwodimensionArrowComponent;
  let fixture: ComponentFixture<TwodimensionArrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwodimensionArrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwodimensionArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
