import { HttpStatusCode } from "@angular/common/http";

export type Response = {
    statusCode: HttpStatusCode;
    isSuccess: boolean;
    errorMessage: string[];
    result: any;
}