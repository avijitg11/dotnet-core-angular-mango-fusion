import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { MenuItemService } from "../../core/services/menuitem.service";
import { MenuItem } from "../../shared/models/menu.item";
import { AddEditMenuItemComponent } from "./add-edit-menu-item/app-add-edit-menu-item.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector:'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    imports:[MenuItemComponent,AddEditMenuItemComponent],
    providers: [MenuItemService]
})
export class MenuComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    menuItemService = inject(MenuItemService);
    menuItems = signal<MenuItem[]>([]);
    isError = signal(false);
    showLoader = signal(true);
    isModalShow = signal(false);
    menuItemId = signal(0);

    ngOnInit(): void {
        this.loadMenuItems();
    }

    private loadMenuItems(){
        this.menuItemService.getMenuItems()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next: (response) => {
                if(response.isSuccess){
                    this.menuItems.set(response.result);
                }
                this.showLoader.set(false);
            },
            error: (err)=>{
                this.isError.set(true);
                this.showLoader.set(false);
            },
            complete: ()=>{
                this.showLoader.set(false);
            }      
        });
    }

    showModal(){
        this.menuItemId.set(0);
        this.isModalShow.set(true);
    }

    hideModal(event:boolean){
        this.isModalShow.set(event);
    }

    reloadMenuItems(event:boolean){
        if(event){
            this.loadMenuItems();
        }
    }

    editItem(event:number){
        this.menuItemId.set(event);
        this.isModalShow.set(true);
    }     
}