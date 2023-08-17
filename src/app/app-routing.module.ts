import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { CategoryComponent } from './category/category.component';
import { PremiumComponent } from './premium/premium.component';
import { BillingComponent } from './billing/billing.component';

export const ApplicationRoutes = {
  home: '',
  login: '/account/login',
  register: '/account/register',
  search: '/search',
  category: '/category',
  post: '/posts',
  premium: '/premium',
  billing: '/billing',
};
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account/login', component: LoginComponent },
  { path: 'account/register', component: RegisterComponent },
  { path: 'posts/:id', component: HomeComponent },
  { path: 'user/:username', component: ProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'premium', component: PremiumComponent },
  { path: 'billing', component: BillingComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
