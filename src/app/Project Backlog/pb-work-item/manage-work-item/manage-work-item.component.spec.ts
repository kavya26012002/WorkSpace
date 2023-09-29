import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkItemComponent } from './manage-work-item.component';

describe('ManageWorkItemComponent', () => {
  let component: ManageWorkItemComponent;
  let fixture: ComponentFixture<ManageWorkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageWorkItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
