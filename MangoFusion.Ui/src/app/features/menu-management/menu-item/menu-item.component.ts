import { Component, DestroyRef, inject, input, output } from "@angular/core";
import { MenuItem } from "../../../shared/models/menu.item";
import { environment } from "../../../../environments/environment";
import Swal from 'sweetalert2';
import { MenuItemService } from "../../../core/services/menuitem.service";

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
                const subscriptions = this.menuItemService.deleteMenuItem(this.menuItem().id).subscribe({
                    next:(response)=>{
                        if(response.isSuccess){
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your item has been deleted.",
                                icon: "success",
                                confirmButtonColor: '#0d6efd'
                            });
                        }else if(!response.isSuccess){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: response.errorMessage.join(' | '),
                                confirmButtonColor: '#fd0d0d'
                            });
                        }
                        this.isLoadMenuItems.emit(true);
                    },
                    error:(err)=> {
                        console.log(err);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                            confirmButtonColor: '#fd0d0d'
                        });
                        this.isLoadMenuItems.emit(true);
                    },
                });
                this.destroyRef.onDestroy(()=>subscriptions.unsubscribe());                
            }
        });
    }

    onEdit(){
        this.menuItemId.emit(this.menuItem().id);
    }
}