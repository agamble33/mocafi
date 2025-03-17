import { Component, inject } from '@angular/core';
import { UserListComponent } from './users/user-list/user-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [
    UserListComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  readonly dialog = inject(MatDialog);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
