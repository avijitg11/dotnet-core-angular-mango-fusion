import { inject } from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../shared/models/response.model';
import { Observable } from 'rxjs';
import { MenuItem } from '../../shared/models/menu.item';


export class MenuItemService{
    private baseUrl : string =  environment.apiUrl;
    private http = inject(HttpClient);

    getMenuItems():Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/MenuItem");
    }

    getMenuItemById(id:number):Observable<Response>{
        return this.http.get<Response>(this.baseUrl + "api/MenuItem/" + id);
    }

    addEditMenuItem(item:MenuItem):Observable<Response>{
        const formData = this.getFormData(item);
        if(item.id === 0){
            return this.http.post<Response>(this.baseUrl + "api/MenuItem/", formData);
        }
        else{
            return this.http.put<Response>(this.baseUrl + "api/MenuItem/" + item.id, formData);
        }        
    }

    deleteMenuItem(id:number):Observable<Response>{
        return this.http.delete<Response>(this.baseUrl + "api/MenuItem/" + id);
    }

    private getFormData(item:MenuItem):FormData{
        const formData = new FormData();
        if (item.id !== 0) {
            formData.append('id', item.id.toString());
        }
        formData.append('name', item.name);
        formData.append('category', item.category);
        formData.append('description', item.description===null?'':item.description);
        formData.append('price', item.price.toString());
        if (item.image instanceof File)
        {
            formData.append('file', item.image);
        }                
        formData.append('specialTag', item.specialTag===null?'':item.specialTag);
        return formData;
    }
}