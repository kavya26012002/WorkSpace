import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkItemComponent } from './edit-work-item.component';

describe('EditWorkItemComponent', () => {
  let component: EditWorkItemComponent;
  let fixture: ComponentFixture<EditWorkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorkItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
