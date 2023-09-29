import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddattachmentComponent } from './addattachment.component';

describe('AddattachmentComponent', () => {
  let component: AddattachmentComponent;
  let fixture: ComponentFixture<AddattachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddattachmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddattachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
