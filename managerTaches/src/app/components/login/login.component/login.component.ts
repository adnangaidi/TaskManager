import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  returnUrl: string = '/tasks';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Si déjà connecté, rediriger
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
    }

    // Récupérer l'URL de retour
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tasks';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const credentials: LoginRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.showNotification('Connexion réussie !', 'success');
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Identifiants incorrects';
        this.showNotification(errorMessage, 'error');
        console.error('Login error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Ce champ est requis';
    }

    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }

    return '';
  }
}
