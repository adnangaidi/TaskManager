import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component/login.component';
import { RegisterComponent } from './components/register/register.component/register.component';
import { TaskListComponent } from './components/task-list/task-list.component/task-list.component';
import { authGuard } from './guards/auth.guard-guard';
import {ProfileComponent} from './components/profile/profile.component/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
