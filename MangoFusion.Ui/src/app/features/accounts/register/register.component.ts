import { Component, DestroyRef, inject, signal } from "@angular/core";
import { RoutePaths } from "../../../shared/models/route.path";
import { Router, RouterLink } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserRoles } from "../../../shared/models/user.roles";
import { AuthService } from "../../../core/services/auth.service";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RegisterUser } from "../../../shared/models/register.user";
import Swal from 'sweetalert2';

@Component({
    selector:'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [RouterLink,ReactiveFormsModule]
})
export class RegisterComponent{
    private destroyRef = inject(DestroyRef);
    private toastr = inject(ToastrService);
    private authService = inject(AuthService);
    private router = inject(Router);
    routePaths = RoutePaths;
    userRoles = UserRoles;
    showSpinner = signal(false);
    registerForm : FormGroup;

    constructor(){
        this.registerForm = new FormGroup({
            name: new FormControl('', Validators.required),
            email:new FormControl('', [Validators.required,Validators.email]),
            passwords: new FormGroup({
                password: new FormControl('',{
                    validators:[Validators.required,Validators.minLength(6)]
                }),
                confirmPassword: new FormControl('')
                },
                {
                    validators:[this.authService.checkPasswordRegex('password'),
                    this.authService.checkEqualValues('password','confirmPassword')]
                }
            ),
            role: new FormControl('')
        });
    }


    onSubmit(){
        this.showSpinner.set(true);
        
        const form = this.registerForm;
        const passwordsGroup = form.get('passwords');
        const user : RegisterUser = {
            email : form.get('email')?.value,
            password : passwordsGroup?.get('password')?.value,
            name : form.get('name')?.value,
            role : form.get('role')?.value
        };

        this.authService.register(user)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next:(response)=>{
                if(response.isSuccess)
                {
                    Swal.fire({
                        title: "User Registered!",
                        text: "User register successfully!",
                        icon: "success",
                        confirmButtonColor: '#0d6efd'
                    });
                    this.showSpinner.set(false);
                    this.router.navigate(['/'+this.routePaths.LOGIN]);
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
        const form = this.registerForm;
        const passwordsGroup = form.get('passwords');
        if (form?.invalid && form?.touched)
        {
            switch (formInput) {
                case 'name':
                    if (form.get('name')?.hasError('required')) {
                        this.toastr.error('Name is required.', 'Error');
                    }
                    break;

                case 'email':
                    const emailCtrl = form.get('email');
                    if (emailCtrl?.hasError('required')) {
                        this.toastr.error('Email is required.', 'Error');
                    } else if (emailCtrl?.hasError('email')) {
                        this.toastr.error('Please enter a valid email address.', 'Error');
                    }
                    break;

                case 'password':
                    const passwordCtrl = passwordsGroup?.get('password');
                    if (passwordCtrl?.hasError('required')) {
                        this.toastr.error('Password is required.', 'Error');
                    } else if (passwordCtrl?.hasError('minlength')) {
                        this.toastr.error('Password must be 6 characters long.', 'Error');
                    } else if (passwordsGroup?.hasError('passwordregexfailed')) {
                        this.toastr.error('Password must contain 1 uppercase + 1 lowercase + 1 special char + 1 digit.', 'Error');
                    }
                    break;

                case 'confirmPassword':
                    const confirmCtrl = passwordsGroup?.get('confirmPassword');
                    if (
                        confirmCtrl?.touched &&
                        passwordsGroup?.hasError('passwordmismatch')
                    ) {
                        this.toastr.error('Passwords do not match.', 'Error');
                    }
                    break;
            }
        }        
    }
    
}




