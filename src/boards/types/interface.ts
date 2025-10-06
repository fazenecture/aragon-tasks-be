


export type ICreateBoardServiceReqObj = {
    name: string;
    description: string | null;

    user_id: string; // created_by
}

export type ICreateBoardDbReqObj = {
    name: string;
    description: string | null;
    
    created_by: string; // user_id
    created_at: string;
}

export type IFetchBoardByIdDbReqObj = {
    id: number;
    name: string;
    description: string | null;
    created_by: number; // user_id
    created_at: string;
    updated_by: number | null; // user_id
    updated_at: string | null;
    deleted_at: string | null;
    deleted_by: number | null; // user_id
}

export type IFetchAllBoardsReqObj = {
    search?: string;
    user_id: number;
}

export type IUpdateBoardServiceReqObj = {
    id: number;
    name?: string;
    description?: string | null;
    user_id: number;
}

export type IUpdateBoardByIdDbObj = {
    id: number;
    name?: string;
    description?: string | null;
    updated_by: number;
    updated_at: string;
}

export type IDeleteBoardServiceReqObj = {
    id: number;
    user_id: number;
}