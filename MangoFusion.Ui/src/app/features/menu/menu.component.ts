import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { MenuItemComponent } from "./menu-items/menu-item.component";
import { MenuItemService } from "../../core/services/menuitem.service";
import { MenuItem } from "../../shared/models/menu.item";
import { Subscription } from "rxjs";

@Component({
    selector:'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    imports:[MenuItemComponent],
    providers: [MenuItemService]
})
export class MenuComponent implements OnInit,OnDestroy{

    menuItemService = inject(MenuItemService);
    menuItems! : MenuItem[];
    menuItemSubscription! : Subscription;
    menuItemCount = signal(0);
    isError = signal(false);
    showLoader = signal(true);

    ngOnInit(): void {
        this.menuItemSubscription = this.menuItemService.getMenuItems().subscribe({
            next: (response) => {
                if(response.isSuccess){
                    this.menuItems = response.result;
                }
                this.showLoader.set(false);
            },
            error: (err)=>{
                this.isError.set(true);
                this.showLoader.set(false);
                console.error(err);
            },
            complete: ()=>{
                this.menuItemCount.set(this.menuItems.length);
                this.showLoader.set(false);
            }      
        });
    }

    ngOnDestroy(): void {
        if (this.menuItemSubscription) {
            this.menuItemSubscription.unsubscribe();
        }
    }


     
}