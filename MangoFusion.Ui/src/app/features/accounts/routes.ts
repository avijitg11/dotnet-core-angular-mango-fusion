import { Route } from "@angular/router";

export const accountRoutes: Route[] = [
    { path: 'login', loadComponent:()=>import('./login/login.component').then(r=>r.LoginComponent)},

    { path: 'register', loadComponent:()=>import('./register/register.component').then(r=>r.RegisterComponent)},
]