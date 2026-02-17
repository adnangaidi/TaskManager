import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    // L'intercepteur ajoutera automatiquement le token
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => console.log('Tasks fetched:', tasks)),
      catchError(this.handleError)
    );
  }


  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(newTask => console.log('Task created:', newTask)),
      catchError(this.handleError)
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(updatedTask => console.log('Task updated:', updatedTask)),
      catchError(this.handleError)
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Task deleted:', id)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
