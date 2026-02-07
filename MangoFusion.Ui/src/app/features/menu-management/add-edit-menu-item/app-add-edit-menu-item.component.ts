import { Component, inject, output, signal, DestroyRef, input, effect } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Category } from "../../../shared/utility/category";
import { SpecialTags } from "../../../shared/utility/special.tags";
import { ToastrService } from 'ngx-toastr';
import { MenuItemService } from "../../../core/services/menuitem.service";
import Swal from 'sweetalert2';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { environment } from "../../../../environments/environment";


@Component({
    selector:'app-add-edit-menu-item',
    templateUrl: './app-add-edit-menu-item.component.html',
    styleUrls: ['./app-add-edit-menu-item.component.css'],
    imports: [ReactiveFormsModule]
})
export class AddEditMenuItemComponent {
    private destroyRef = inject(DestroyRef);
    private toastr = inject(ToastrService);
    private baseUrl : string =  environment.apiUrl;
    isModalShow = output<boolean>();
    isLoadMenuItems = output<boolean>();
    category = Category;
    specialTags = SpecialTags;
    showSpinner = signal(false);
    menuItemForm: FormGroup;
    imagePreview = signal<string | ArrayBuffer | null>(null);
    menuItemService = inject(MenuItemService);
    menuItemId = input.required<number>();

    constructor()
    {
        this.menuItemForm = new FormGroup({
            id: new FormControl(0),
            name: new FormControl('', Validators.required),
            description: new FormControl(''),
            category: new FormControl('', Validators.required),
            specialTag: new FormControl(''),
            price: new FormControl('', [
                Validators.required,
                Validators.min(3),
                Validators.max(20)
            ]),
            image: new FormControl(null, Validators.required)
        });

        effect(() => {
            const id = this.menuItemId();
            if (id && id !== 0) {
                this.getMenuItemById(id);
                const imageCtrl = this.menuItemForm.get('image');
                imageCtrl?.clearValidators();
                imageCtrl?.updateValueAndValidity();
            }
        });
    }

    getMenuItemById(id:number){
        this.menuItemService.getMenuItemById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.menuItemForm.patchValue(response.result);
                    this.imagePreview.set(`${this.baseUrl}/${response.result.image}`);
                }
            }
        });
    }


    onFileChange(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        // set file to form control
        this.menuItemForm.patchValue({ image: file });
        this.menuItemForm.get('image')?.updateValueAndValidity();

        // preview
        const reader = new FileReader();
        reader.onload = () => (this.imagePreview.set(reader.result));
        reader.readAsDataURL(file);
    }
    

    onBlur(formInput:string){
        if(formInput === 'name' && this.menuItemForm.value.name === '' && this.menuItemForm.invalid)
        {
            this.toastr.error('Name is required.', 'Error');
        }
        else if(formInput ==='category' && this.menuItemForm.value.category === ''  && this.menuItemForm.invalid){
            this.toastr.error('Category is required.', 'Error');
        }
        else if(formInput ==='price' && (this.menuItemForm.value.price === '' 
            || this.menuItemForm.value.price < 3 || this.menuItemForm.value.price > 20)  
            && this.menuItemForm.invalid){
            this.toastr.error('Price is required between 3-20.', 'Error');
        }
        else if(formInput === 'image' && this.menuItemForm.value.image === null && this.menuItemForm.invalid){
            this.toastr.error('Image is required.', 'Error');
        }
    }

    hideModal(){
        this.isModalShow.emit(false);
    }

    onSubmit(){
        this.showSpinner.set(true);
        this.menuItemService.addEditMenuItem(this.menuItemForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next:(response)=> {
                if(response.isSuccess && response.statusCode === 201)
                {
                    Swal.fire({
                        title: "Item saved!",
                        text: "Menu item saved successfully!",
                        icon: "success",
                        confirmButtonColor: '#0d6efd'
                    });
                }
                else if(response.isSuccess && response.statusCode !== 201){
                    Swal.fire({
                        title: "Item updated!",
                        text: "Menu item updated successfully!",
                        icon: "success",
                        confirmButtonColor: '#0d6efd'
                    });
                }
                else if(!response.isSuccess){
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: response.errorMessage.join(' | '),
                        confirmButtonColor: '#fd0d0d'
                    });
                }               
            },
            error:(err)=>{
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    confirmButtonColor: '#fd0d0d'
                });
                this.showSpinner.set(false);
                this.isModalShow.emit(false);
                this.isLoadMenuItems.emit(true);
            },
            complete:()=>{
                this.showSpinner.set(false);
                this.isModalShow.emit(false);
                this.isLoadMenuItems.emit(true);
            }
        });
    }
}