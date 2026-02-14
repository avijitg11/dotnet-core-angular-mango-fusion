import { Route } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { authGuard } from '../../core/guards/auth.guard';

export const accountRoutes: Route[] = [
    { path: 'login', component: LoginComponent ,canActivate: [authGuard]},
    { path: 'register', component: RegisterComponent,canActivate: [authGuard] },
]