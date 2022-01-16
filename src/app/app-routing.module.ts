import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [
  {path : '', redirectTo: 'login', pathMatch: 'full'},
  {path : 'login', component: LoginComponent},
  {path : 'transactions', component: TransactionListComponent, canActivate: [AuthGuard]},
  {path : '**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
