import { randomUUID } from "node:crypto";
import BoardsHelper from "./helper";
import { 
    ICreateBoardDbReqObj, 
    ICreateBoardServiceReqObj,
    IFetchAllBoardsReqObj,
    IUpdateBoardServiceReqObj,
    IDeleteBoardServiceReqObj
} from "./types/interface";
import moment from "moment";
import ErrorHandler from "../utils/error.handler";

export default class BoardsService extends BoardsHelper {


    protected createBoardService = async (obj: ICreateBoardServiceReqObj) => {
        const { name, description, user_id } = obj;

        const dbObj: ICreateBoardDbReqObj = {
            name,
            description,
            created_by: user_id,
            created_at: moment().format(),
        }

        return this.createBoardDb(dbObj);
    }

    protected fetchAllBoardsService = async (obj: IFetchAllBoardsReqObj) => {
        return this.fetchAllBoardsDb(obj);
    }

    protected fetchBoardByIdService = async (id: number) => {
        const boardDetails = await this.fetchBoardByIdDb(id);

        if (!boardDetails) {
            throw new ErrorHandler({
                status_code: 400,
                message: "Board not found!",
            });
        }

        return boardDetails;
    }

    protected updateBoardByIdService = async (obj: IUpdateBoardServiceReqObj) => {
        const { user_id, id, ...updateFields } = obj;

        const boardDetails = await this.fetchBoardByIdDb(id);

        if (!boardDetails) {
            throw new ErrorHandler({
                status_code: 400,
                message: "Board not found!",
            });
        }

        const updateObj: any = {
            id,
            updated_by: user_id,
            updated_at: moment().format(),
        };

        if (updateFields.name !== undefined) {
            Object.assign(updateObj, {
                name: updateFields.name
            })
        }

        if (updateFields.description !== undefined) {
            Object.assign(updateObj, {
                description: updateFields.description
            })
        }

        return this.updateBoardByIdDb(updateObj);
    }

    protected deleteBoardByIdService = async (obj: IDeleteBoardServiceReqObj) => {
        const { user_id, id } = obj;

        const boardDetails = await this.fetchBoardByIdDb(id);

        if (!boardDetails) {
            throw new ErrorHandler({
                status_code: 400,
                message: "Board not found!",
            });
        }

        return this.deleteBoardByIdDb({
            id,
            updated_by: user_id,
            updated_at: moment().format(),
        });
    }


}