import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, RegisterRequest } from '../models/auth-request.model';
import { AuthResponse } from '../models/auth-response.model';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:8080/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject!: BehaviorSubject<boolean>;
  public isAuthenticated$!: Observable<boolean>;

  private currentUserSubject!: BehaviorSubject<any>;
  public currentUser$!: Observable<any>;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    // Initialiser après que tokenService soit disponible
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.tokenService.isLoggedIn());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    this.currentUserSubject = new BehaviorSubject<any>(this.tokenService.getUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${AUTH_API}/signin`, credentials, httpOptions)
      .pipe(
        tap(response => {
          this.tokenService.saveToken(response.token);
          this.tokenService.saveUser(response);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response);
        })
      );
  }

  // Register
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${AUTH_API}/signup`, userData, httpOptions);
  }

  // Logout
  logout(): void {
    this.tokenService.clearStorage();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  // Récupérer l'utilisateur courant
  getCurrentUser(): any {
    return this.tokenService.getUser();
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.includes(role);
  }

  // Récupérer le username
  getUsername(): string | null {
    const user = this.getCurrentUser();
    return user ? user.username : null;
  }
}
