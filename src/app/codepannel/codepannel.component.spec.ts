import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodepannelComponent } from './codepannel.component';

describe('CodepannelComponent', () => {
  let component: CodepannelComponent;
  let fixture: ComponentFixture<CodepannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodepannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodepannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
