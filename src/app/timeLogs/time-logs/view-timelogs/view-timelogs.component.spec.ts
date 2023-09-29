import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimelogsComponent } from './view-timelogs.component';

describe('ViewTimelogsComponent', () => {
  let component: ViewTimelogsComponent;
  let fixture: ComponentFixture<ViewTimelogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTimelogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTimelogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
