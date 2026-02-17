import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskStatus, TASK_STATUS_CONFIG } from '../../../models/task';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  statusOptions = TASK_STATUS_CONFIG;
  isEditMode: boolean;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.isEditMode = !!data;
    this.dialogTitle = this.isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche';

    this.taskForm = this.fb.group({
      id: [data?.id || null],
      title: [data?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [data?.description || '', [Validators.required, Validators.minLength(5)]],
      status: [data?.status || TaskStatus.EN_COURS, Validators.required],
      dueDate: [data?.dueDate || null]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      const task: Task = {
        ...formValue,
        createdAt: this.data?.createdAt || new Date()
      };

      this.dialogRef.close(task);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);

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
