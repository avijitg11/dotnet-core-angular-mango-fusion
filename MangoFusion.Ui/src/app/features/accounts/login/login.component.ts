import { Component, DestroyRef, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { RoutePaths } from "../../../shared/models/route.path";
import { AuthService } from "../../../core/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LoginUser } from "../../../shared/models/login.user";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import Swal from 'sweetalert2';

@Component({
    selector:'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [RouterLink,ReactiveFormsModule]
})
export class LoginComponent{ 
    private destroyRef = inject(DestroyRef);
    private toastr = inject(ToastrService);
    private authService = inject(AuthService); 
    private router = inject(Router);  
    routePaths = RoutePaths;
    showSpinner = signal(false);
    loginForm : FormGroup;

    constructor(){
        this.loginForm = new FormGroup(
            {
                email: new FormControl('', [
                    Validators.required,
                    Validators.email
                ]),
                password: new FormControl('', [
                    Validators.required,
                    Validators.minLength(6)
                ])
            },
            {
                validators: [this.authService.checkPasswordRegex('password')]
            }
        );
    }

    onSubmit(){
        this.showSpinner.set(true);        
        const form = this.loginForm;
        
        const user : LoginUser = {
            email : form.get('email')?.value,
            password : form.get('password')?.value
        };
        
        this.authService.login(user)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next:(response)=>{
                if(response.isSuccess)
                {
                    Swal.fire({
                        title: "User Login!",
                        text: "User login successfully!",
                        icon: "success",
                        confirmButtonColor: '#0d6efd'
                    });
                    this.authService.setAuth(response.result.token);
                    this.showSpinner.set(false);
                    this.router.navigate([this.routePaths.HOME]);                    
                }
            },
            error:(err)=>{
                let message = '';
                if (Array.isArray(err.error?.errorMessage)) {
                    message = err.error.errorMessage.join(' | ');
                } else {
                    message = err.error?.errorMessage || "Something went wrong.";
                }
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: message,
                    confirmButtonColor: '#fd0d0d'
                });
                this.showSpinner.set(false);
            }
        });
    }

    onBlur(formInput:string){
        const form = this.loginForm;
        if (form?.invalid && form?.touched)
        {
            switch (formInput) {
                case 'email':
                    const emailCtrl = form.get('email');
                    if (emailCtrl?.hasError('required')) {
                        this.toastr.error('Email is required.', 'Error');
                    } else if (emailCtrl?.hasError('email')) {
                        this.toastr.error('Please enter a valid email address.', 'Error');
                    }
                    break;

                case 'password':
                    const passwordCtrl = form.get('password');
                    if (passwordCtrl?.hasError('required')) {
                        this.toastr.error('Password is required.', 'Error');
                    } else if (passwordCtrl?.hasError('minlength')) {
                        this.toastr.error('Password must be 6 characters long.', 'Error');
                    } else if (form?.hasError('passwordregexfailed')) {
                        this.toastr.error('Password must contain 1 uppercase + 1 lowercase + 1 special char + 1 digit.', 'Error');
                    }
                    break;
            }
        }        
    }
}


