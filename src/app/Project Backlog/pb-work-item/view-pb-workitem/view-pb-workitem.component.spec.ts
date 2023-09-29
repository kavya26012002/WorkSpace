import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPbWorkitemComponent } from './view-pb-workitem.component';

describe('ViewPbWorkitemComponent', () => {
  let component: ViewPbWorkitemComponent;
  let fixture: ComponentFixture<ViewPbWorkitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPbWorkitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPbWorkitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
