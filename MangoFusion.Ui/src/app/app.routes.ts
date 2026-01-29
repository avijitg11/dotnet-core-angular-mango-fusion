import { Routes } from '@angular/router';
import { RoutePaths } from './shared/utility/path.routes';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/accounts/login/login.component';
import { RegisterComponent } from './features/accounts/register/register.component';
import { MenuComponent } from './features/menu/menu.component';

export const routes: Routes = [
    {path:RoutePaths.HOME,component:HomeComponent},
    {path:RoutePaths.LOGIN,component:LoginComponent},
    {path:RoutePaths.REGISTER,component:RegisterComponent},
    {path:RoutePaths.MENU_MANAGEMENT,component:MenuComponent}
];
