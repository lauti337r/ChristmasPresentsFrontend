import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { KidComponent } from './kid/kid.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ChristmasPresentsService} from './christmas-presents.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { KidDetailsComponent } from './kid-details/kid-details.component';
import { KidsListComponent } from './kids-list/kids-list.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './admin/login/login.component';
import { AdminComponent } from './admin/admin/admin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminKidsComponent } from './admin/admin-kids/admin-kids.component';
import { AdminGiversComponent } from './admin/admin-givers/admin-givers.component';
import {DecimalPipe} from '@angular/common';
import {NgbdSortableHeader} from './shared/sortable-directive';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    KidComponent,
    KidDetailsComponent,
    KidsListComponent,
    LoginComponent,
    AdminComponent,
    AdminKidsComponent,
    AdminGiversComponent,
    NgbdSortableHeader
  ],
  imports: [
    RouterModule,
    BrowserModule,
    NgbModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ],
  providers: [ChristmasPresentsService, DecimalPipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
