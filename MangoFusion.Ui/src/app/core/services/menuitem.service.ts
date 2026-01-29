import { inject } from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../shared/models/response.model';
import { Observable } from 'rxjs';


export class MenuItemService{
    private baseUrl : string =  environment.apiUrl;
    private http = inject(HttpClient);

    getMenuItems():Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/MenuItem");
    }

    getMenuItemById(id:number):Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/MenuItem/" + id);
    }
}