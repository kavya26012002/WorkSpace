import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTitleTooltipComponent } from './project-title-tooltip.component';

describe('ProjectTitleTooltipComponent', () => {
  let component: ProjectTitleTooltipComponent;
  let fixture: ComponentFixture<ProjectTitleTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTitleTooltipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTitleTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
