import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkItemComponent } from './view-work-item.component';

describe('ViewWorkItemComponent', () => {
  let component: ViewWorkItemComponent;
  let fixture: ComponentFixture<ViewWorkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWorkItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
