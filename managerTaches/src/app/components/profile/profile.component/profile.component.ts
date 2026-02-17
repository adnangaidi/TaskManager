import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any;
  isLoadingProfile = false;
  isLoadingPassword = false;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.profileForm.patchValue({
      username: this.currentUser?.username,
      email: this.currentUser?.email
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (!newPassword || !confirmPassword) return null;
    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;
    this.isLoadingProfile = true;

    this.userService.updateProfile(this.currentUser.id, this.profileForm.value).subscribe({
      next: () => {
        this.showNotification('Profil mis à jour avec succès', 'success');
        this.isLoadingProfile = false;
      },
      error: (error) => {
        this.showNotification(error.error?.message || 'Erreur lors de la mise à jour', 'error');
        this.isLoadingProfile = false;
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;
    this.isLoadingPassword = true;

    const { oldPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.showNotification('Mot de passe changé avec succès', 'success');
        this.passwordForm.reset();
        this.isLoadingPassword = false;
      },
      error: (error) => {
        this.showNotification(error.error?.message || 'Erreur lors du changement de mot de passe', 'error');
        this.isLoadingPassword = false;
      }
    });
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.hasError('required')) return 'Ce champ est requis';
    if (field?.hasError('minlength')) return `Minimum ${field.errors?.['minlength'].requiredLength} caractères`;
    if (field?.hasError('maxlength')) return `Maximum ${field.errors?.['maxlength'].requiredLength} caractères`;
    if (field?.hasError('email')) return 'Email invalide';
    if (fieldName === 'confirmPassword' && this.passwordForm.hasError('passwordMismatch')) return 'Les mots de passe ne correspondent pas';
    return '';
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
