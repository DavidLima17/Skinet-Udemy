import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoudComponent } from './core/not-foud/not-foud.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
                        {path: 'test-error', component: TestErrorComponent, data: {breadcrumb: 'Test Errors'}},
                        {path: 'not-found', component: NotFoudComponent, data: {breadcrumb: 'Not Found'}},
                        {path: 'server-error', component: ServerErrorComponent, data: {breadcrumb: 'Server Error'}},
                        {path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule), data: {breadcrumb: 'shop'}},
                        {path: '**', redirectTo: 'not-found', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
