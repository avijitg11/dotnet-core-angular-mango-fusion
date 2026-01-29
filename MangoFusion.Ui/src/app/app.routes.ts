import { Routes } from '@angular/router';
import { RoutePaths } from './shared/utility/route.paths';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/accounts/login/login.component';
import { RegisterComponent } from './features/accounts/register/register.component';

export const routes: Routes = [
    {path:RoutePaths.HOME,component:HomeComponent},
    {path:RoutePaths.LOGIN,component:LoginComponent},
    {path:RoutePaths.REGISTER,component:RegisterComponent}
];
