import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkItemComponent } from './add-work-item.component';

describe('AddWorkItemComponent', () => {
  let component: AddWorkItemComponent;
  let fixture: ComponentFixture<AddWorkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
