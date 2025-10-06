import { 
    ICreateBoardDbReqObj, 
    IFetchBoardByIdDbReqObj,
    IFetchAllBoardsReqObj,
    IUpdateBoardByIdDbObj
} from "./types/interface";
import db from "../config/postgres";

export default class BoardsDb {

  protected createBoardDb = async (obj: ICreateBoardDbReqObj) => {
    const query = db.format(`INSERT INTO boards ? RETURNING *`, obj);

    const { rows } = await db.query(query);
    return rows[0] as unknown as any;
  };

  public fetchBoardByIdDb = async (board_id: number) => {
    const query = `SELECT * 
      FROM boards 
      WHERE id = $1 AND deleted_at IS NULL
      LIMIT 1
      `;
    const values = [board_id];

    const { rows } = await db.query(query, values);
    return rows[0] as unknown as IFetchBoardByIdDbReqObj;
  }

  protected fetchAllBoardsDb = async (obj: IFetchAllBoardsReqObj) => {
    const { search, user_id } = obj;

    let whereQuery = " boards.deleted_at IS NULL ";
    const values: (string | number)[] = [];
    let idx = 1;

    if (search) {
      whereQuery += ` AND (boards.name ILIKE $${idx} OR boards.description ILIKE $${idx}) `;
      values.push(`%${search}%`);
      idx++;
    }

    // Filter boards where user created the board OR has tasks in the board
    whereQuery += ` AND (
      boards.created_by = $${idx} OR 
      EXISTS (
        SELECT 1 FROM tasks 
        WHERE tasks.board_id = boards.id 
        AND (tasks.created_by = $${idx} OR tasks.updated_by = $${idx})
        AND tasks.deleted_at IS NULL
      )
    )`;
    values.push(user_id);
    idx++;

    whereQuery += " ORDER BY boards.created_at ASC ";

    const query = `
      SELECT 
        boards.id, boards.name, boards.description,
        boards.created_at, 
        json_build_object('id', created_by_user.id, 'name', created_by_user.name, 'email', created_by_user.email) AS created_by,
        boards.updated_at, 
        json_build_object('id', updated_by_user.id, 'name', updated_by_user.name, 'email', updated_by_user.email) AS updated_by,
        (
          SELECT COUNT(*) FROM tasks 
          WHERE tasks.board_id = boards.id 
          AND tasks.deleted_at IS NULL
        ) AS task_count
      FROM boards
        LEFT JOIN users AS created_by_user ON boards.created_by = created_by_user.id
        LEFT JOIN users AS updated_by_user ON boards.updated_by = updated_by_user.id
      WHERE
        ${whereQuery}
    `;

    const { rows } = await db.query(query, values);
    return rows;
  }

  protected updateBoardByIdDb = async (obj: IUpdateBoardByIdDbObj) => {
    const { id, ...rest } = obj;

    const query = db.format(`UPDATE boards SET ? WHERE id = $1`, rest);
    await db.query(query, [id]);
  }

  protected deleteBoardByIdDb = async (obj: { id: number; updated_by: number; updated_at: string }) => {
    const { id, updated_by, updated_at } = obj;

    const query = `UPDATE boards 
      SET deleted_at = $1, updated_by = $2, updated_at = $3 
      WHERE id = $4 AND deleted_at IS NULL`;
    
    await db.query(query, [updated_at, updated_by, updated_at, id]);
  }

}
