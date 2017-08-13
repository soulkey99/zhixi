import { Routes, RouterModule } from '@angular/router';
import { HomeworkDetailComponent } from './homework-detail.component';

export const routes: Routes = [
  {
    path: 'homework-detail/:filter',
    component: HomeworkDetailComponent
  }
];
export const routing = RouterModule.forChild(routes);