import { Component, input } from "@angular/core";
import { MenuItem } from "../../../shared/models/menu.item";
import { environment } from "../../../../environments/environment";

@Component({
    selector:'[app-menu-item]',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent{
    menuItem = input.required<MenuItem>();
    baseUrl = environment.apiUrl;
}