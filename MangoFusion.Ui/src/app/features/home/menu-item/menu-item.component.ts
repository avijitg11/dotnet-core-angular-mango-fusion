import { Component, input } from "@angular/core";
import { MenuItem } from "../../../shared/models/menu.item";
import { environment } from "../../../../environments/environment";
import { RouterLink } from "@angular/router";
import { RoutePaths } from "../../../shared/models/route.path";


@Component({
    selector:'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.css'],
    imports: [RouterLink]
})
export class MenuItemComponent{
    menuItem = input.required<MenuItem>();
    baseUrl = environment.apiUrl;
    routePaths = RoutePaths
}