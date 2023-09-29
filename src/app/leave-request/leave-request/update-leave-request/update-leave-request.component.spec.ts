import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLeaveRequestComponent } from './update-leave-request.component';

describe('UpdateLeaveRequestComponent', () => {
  let component: UpdateLeaveRequestComponent;
  let fixture: ComponentFixture<UpdateLeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLeaveRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
