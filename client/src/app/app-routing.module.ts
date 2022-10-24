import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoudComponent } from './core/not-foud/not-foud.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{path: '', component: HomeComponent},
                        {path: 'test-error', component: TestErrorComponent},
                        {path: 'not-found', component: NotFoudComponent},
                        {path: 'server-error', component: ServerErrorComponent},
                        {path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule)},
                        {path: '**', redirectTo: '', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
