import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KidsListComponent} from './kids-list/kids-list.component';
import {RouterModule, Routes} from '@angular/router';
import {KidDetailsComponent} from './kid-details/kid-details.component';
import {AdminComponent} from './admin/admin/admin.component';
import {LoginComponent} from './admin/login/login.component';
import { AdminKidsComponent } from './admin/admin-kids/admin-kids.component';
import {AdminGiversComponent} from './admin/admin-givers/admin-givers.component';

const routes: Routes = [
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin', component:  AdminComponent },
  { path: 'admin/*', component: LoginComponent },
  { path: 'chicos/detalle', component: KidDetailsComponent },
  { path: 'admin/chicos', component: AdminKidsComponent},
  { path: 'admin/padrinos', component: AdminGiversComponent},
  { path: '**', redirectTo: 'chicos' },
  { path: 'chicos', component: KidsListComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
