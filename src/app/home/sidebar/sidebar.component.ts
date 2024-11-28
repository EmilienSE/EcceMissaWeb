import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = false;
  @Output() closeMenu = new EventEmitter<boolean>;

  constructor(private authService: AuthService){}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  closeSidebar() {
    this.closeMenu.emit(true);
  }

  logout() {
    this.authService.logout();
    this.closeSidebar();
  }
}
