export type CartItem = {
    id: number,
    name:string,
    image:string | File | null,
    price:number,
    quantity:number,
    isQuantityFixed:boolean
}