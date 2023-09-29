import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServiceRequestComponent } from './update-service-request.component';

describe('UpdateServiceRequestComponent', () => {
  let component: UpdateServiceRequestComponent;
  let fixture: ComponentFixture<UpdateServiceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateServiceRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
