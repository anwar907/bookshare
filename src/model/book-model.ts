
export type CreateBookRequest = {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
}


export type UpdateBookRequest = {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
}

export type BookResponse = {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export type DeleteBookRequest = {
    id: string;
}

