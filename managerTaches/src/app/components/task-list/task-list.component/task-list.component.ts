import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task, TaskStatus, TASK_STATUS_CONFIG, TaskStatusInfo } from '../../../models/task';
import { TaskService } from '../../../services/task.service';
import { TaskDialogComponent } from '../../task-dialog/task-dialog.component/task-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component/confirm-dialog.component';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['title', 'description', 'status', 'createdAt', 'dueDate', 'actions'];
  dataSource: MatTableDataSource<Task>;
  statusConfig = TASK_STATUS_CONFIG;
  selectedStatus: string = 'ALL';
  searchText: string = '';
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Task>();
  }

  ngOnInit(): void {
    this.loadTasks();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadTasks(): void {
    this.isLoading = true;

    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.dataSource.data = tasks;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource._updateChangeSubscription();
        // Ne pas attacher paginator/sort ici, c'est fait dans ngAfterViewInit
        this.setupFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.showNotification('Erreur lors du chargement des tâches', 'error');
        this.isLoading = false;
        console.error('Error loading tasks:', error);
      }
    });
  }

  setupFilters(): void {
    this.dataSource.filterPredicate = (data: Task, filter: string) => {
      const searchStr = this.searchText.toLowerCase().trim();
      const matchesSearch = searchStr === '' ||
        data.title.toLowerCase().includes(searchStr) ||
        data.description.toLowerCase().includes(searchStr);

      if (this.selectedStatus === 'ALL') {
        return matchesSearch;
      }

      return matchesSearch && data.status === this.selectedStatus;
    };
  }


  applyFilter(): void {
    this.dataSource.filter = `${this.searchText}-${this.selectedStatus}-${Date.now()}`;
    this.dataSource.paginator?.firstPage();
    this.dataSource._updateChangeSubscription();
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: task ? { ...task } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          this.updateTask(result);
        } else {
          this.createTask(result);
        }
      }
    });
  }

  createTask(task: Task): void {
    this.taskService.createTask(task).subscribe({
      next: () => {
        this.showNotification('Tâche créée avec succès', 'success');
        this.loadTasks();
      },
      error: (error) => {
        this.showNotification('Erreur lors de la création de la tâche', 'error');
        console.error('Error creating task:', error);
      }
    });
  }

  updateTask(task: Task): void {
    if (task.id) {
      this.taskService.updateTask(task.id, task).subscribe({
        next: () => {
          this.showNotification('Tâche mise à jour avec succès', 'success');
          this.loadTasks();
        },
        error: (error) => {
          this.showNotification('Erreur lors de la mise à jour de la tâche', 'error');
          console.error('Error updating task:', error);
        }
      });
    }
  }

  openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && task.id) {
        this.deleteTask(task.id);
      }
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.showNotification('Tâche supprimée avec succès', 'success');
        this.loadTasks();
      },
      error: (error) => {
        this.showNotification('Erreur lors de la suppression de la tâche', 'error');
        console.error('Error deleting task:', error);
      }
    });
  }

  getStatusInfo(status: TaskStatus): TaskStatusInfo {
    return this.statusConfig.find(s => s.value === status) || this.statusConfig[0];
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
