import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'projetos/:id', component: HomeComponent },
  { path: '', component: DashboardComponent },
];
