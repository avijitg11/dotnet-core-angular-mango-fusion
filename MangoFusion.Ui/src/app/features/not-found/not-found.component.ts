import { Component } from "@angular/core";
import { RoutePaths } from "../../shared/models/route.path";
import { RouterLink } from "@angular/router";


@Component({
    selector:'app-not-found',
    templateUrl:'./not-found.component.html',
    imports: [RouterLink]
})
export class NotFoundComponent{
    routePaths = RoutePaths;

}