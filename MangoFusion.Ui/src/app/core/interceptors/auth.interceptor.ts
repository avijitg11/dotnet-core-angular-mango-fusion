import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { HttpInterceptorFn } from "@angular/common/http";

export const AuthInterceptor: HttpInterceptorFn = (request, next) => {

  const authService = inject(AuthService);
  const authState = authService.getAuth();

  if (!authState.isAuthenticated || !authState.token) {
    return next(request);
  }

  if (request.url.includes('api/MenuItem') && request.method !== 'GET') {
    const modifiedReq = request.clone({
        setHeaders: {
            Authorization: `Bearer ${authState.token}`
        }
    });

    return next(modifiedReq);
  }

  return next(request);
};