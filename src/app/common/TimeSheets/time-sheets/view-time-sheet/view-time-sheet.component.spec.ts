import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimeSheetComponent } from './view-time-sheet.component';

describe('ViewTimeSheetComponent', () => {
  let component: ViewTimeSheetComponent;
  let fixture: ComponentFixture<ViewTimeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTimeSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
