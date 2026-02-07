import { Component, computed, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { MenuItemService } from "../../core/services/menuitem.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MenuItem } from "../../shared/models/menu.item";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { Category } from "../../shared/utility/category";

@Component({
    selector:'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers:[MenuItemService],
    imports:[MenuItemComponent]
})
export class HomeComponent implements OnInit {
    private destroyRef = inject(DestroyRef);
    private menuItemService = inject(MenuItemService);
    allMenuItems = signal<MenuItem[]>([]);
    isError = signal(false);
    showLoader = signal(true);
    categoryList = Category;
    selectedCategory = signal('');
    searchText = signal('');

    ngOnInit(): void {
        this.menuItemService.getMenuItems()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next: (response) => {
                if(response.isSuccess){
                    this.allMenuItems.set(response.result);
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

    onChangeCategory(event: Event) {
        this.selectedCategory.set(
            (event.target as HTMLSelectElement).value
        );
    }

    searchByName(event: Event) {
        this.searchText.set(
            (event.target as HTMLInputElement).value
        );
    }

    filteredMenuItems = computed(() => {
        const category = this.selectedCategory();
        const name = this.searchText().toLowerCase();

        return this.allMenuItems().filter(item => {
            const matchCategory = !category || item.category === category;
            const matchName = !name || item.name.toLowerCase().includes(name);

            return matchCategory && matchName;
        });
    });
}