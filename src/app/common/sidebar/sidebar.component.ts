import { Component, EventEmitter, Output } from '@angular/core';
import { DiaplayHeaderService } from '../services/displayheader.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() menuItemClicked = new EventEmitter<string>();
  constructor(private displayHeader: DiaplayHeaderService)
  {}


    showWorkspaceDropdown = false;
    showKnowledgeDropdown = false;
    showProjectDropdown = false;
    showTrainingDropdown = false;
    iconToggleWorkspace = true;
    iconToggleKnowledge = true;
    iconToggleProject = true;
    iconToggleTraining = true;
    
    toggleWorkspaceDropdown() {
      this.showWorkspaceDropdown = !this.showWorkspaceDropdown;
      this.iconToggleWorkspace = !this.iconToggleWorkspace;
    
      
      this.showKnowledgeDropdown = false;
      this.iconToggleKnowledge = true;
      this.showProjectDropdown = false;
      this.iconToggleProject = true;
      this.showTrainingDropdown = false;
      this.iconToggleProject = true;
    }
    
    toggleKnowledgeDropdown() {
      this.showKnowledgeDropdown = !this.showKnowledgeDropdown;
      this.iconToggleKnowledge = !this.iconToggleKnowledge;
    }
    toggleProjectDropdown()
    {
      this.showProjectDropdown = !this.showProjectDropdown;
      this.iconToggleProject = !this.iconToggleProject;
      this.showWorkspaceDropdown = false;
      this.iconToggleWorkspace = true;
      this.showTrainingDropdown = false;
      this.iconToggleProject = true;
    }
    
    toggleTainingDropdown()
    {
    this.showTrainingDropdown = !this.showTrainingDropdown;
    this.iconToggleTraining = !this.iconToggleTraining;
    this.showWorkspaceDropdown = false;
    this.iconToggleWorkspace = true;
    this.showProjectDropdown = false;
    this.iconToggleProject = true;
    }
    onMenuItemClick(itemName: string) {
      this.menuItemClicked.emit(itemName);
      this.displayHeader.setSelectedItem(itemName);

    }
   
}
