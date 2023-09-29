import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-title-tooltip',
  templateUrl: './project-title-tooltip.component.html',
  styleUrls: ['./project-title-tooltip.component.css']
})
export class ProjectTitleTooltipComponent {
  @Input() projectTitle: string = '';
}
