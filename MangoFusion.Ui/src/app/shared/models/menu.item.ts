export type MenuItem = {
    id:number;
    name:string;
    description:string;
    category:string;
    specialTag:string;
    price: number;
    image: File | string | null;
    rating: number;
}