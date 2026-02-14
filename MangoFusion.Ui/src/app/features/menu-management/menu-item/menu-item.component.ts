import { Component, DestroyRef, inject, input, output } from "@angular/core";
import { MenuItem } from "../../../shared/models/menu.item";
import { environment } from "../../../../environments/environment";
import Swal from 'sweetalert2';
import { MenuItemService } from "../../../core/services/menuitem.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector:'[app-menu-item]',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent{
    menuItem = input.required<MenuItem>();
    baseUrl = environment.apiUrl;
    menuItemService = inject(MenuItemService);
    isLoadMenuItems = output<boolean>();
    private destroyRef = inject(DestroyRef);
    menuItemId = output<number>();

    onDelete(){
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed) {
                this.menuItemService.deleteMenuItem(this.menuItem().id)
                .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
                    next:(response)=>{
                        if(response.isSuccess){
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your item has been deleted.",
                                icon: "success",
                                confirmButtonColor: '#0d6efd'
                            });
                        }
                        this.isLoadMenuItems.emit(true);
                    },
                    error:(err)=> {
                        let message = '';
                        if (err.status === 401) {
                            message = "You are unauthorized.";
                        } else if (Array.isArray(err.error?.errorMessage)) {
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
                        this.isLoadMenuItems.emit(true);
                    },
                });             
            }
        });
    }

    onEdit(){
        this.menuItemId.emit(this.menuItem().id);
    }
}