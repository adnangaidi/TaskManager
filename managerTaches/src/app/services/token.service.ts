import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  // Sauvegarder le token
  saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Supprimer le token
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  // Sauvegarder les informations utilisateur
  saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Récupérer les informations utilisateur
  getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  // Supprimer les informations utilisateur
  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Nettoyer tout
  clearStorage(): void {
    localStorage.clear();
  }
}
