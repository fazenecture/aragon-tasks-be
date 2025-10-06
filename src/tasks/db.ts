import {
  ICreateTaskDbReqObj,
  IFetchAllTasksReqObj,
  ITaskByIdDbObj,
  IUpdateTaskByIdDbObj,
} from "./types/interface";
import db from "../config/postgres";

export default class TasksDb {
  // fetch all tasks for a board grouped by status with counts
  protected fetchAllTasks = async (obj: IFetchAllTasksReqObj) => {
    const { board_id, search, filter_user_id } = obj;

    const values = [
      board_id,
      search ? `%${search}%` : null,
      filter_user_id ?? null,
    ];

    const sql = `
    WITH filtered AS (
      SELECT
        t.id, t.board_id, t.slug, t.title, t.description, t.status,
        t.created_at,
        json_build_object('id', cu.id, 'name', cu.name, 'email', cu.email) AS created_by,
        t.updated_at,
        json_build_object('id', uu.id, 'name', uu.name, 'email', uu.email) AS updated_by
      FROM tasks t
      LEFT JOIN users cu ON t.created_by = cu.id
      LEFT JOIN users uu ON t.updated_by = uu.id
      WHERE t.board_id = $1
        AND t.deleted_at IS NULL
        AND (
          $2::text IS NULL
          OR (t.title ILIKE $2 OR t.description ILIKE $2)
        )
        AND (
          $3::bigint IS NULL
          OR (t.created_by = $3 OR t.updated_by = $3)
        )
    ),
    ordered AS (
      SELECT * FROM filtered ORDER BY created_at DESC
    )
    SELECT
      jsonb_build_object(
        'pending',      COALESCE(jsonb_agg(to_jsonb(ordered)) FILTER (WHERE status = 'pending'),      '[]'::jsonb),
        'in_progress',  COALESCE(jsonb_agg(to_jsonb(ordered)) FILTER (WHERE status = 'in_progress'),  '[]'::jsonb),
        'completed',    COALESCE(jsonb_agg(to_jsonb(ordered)) FILTER (WHERE status = 'completed'),    '[]'::jsonb)
      ) AS tasks,
      jsonb_build_object(
        'pending',      COUNT(*) FILTER (WHERE status = 'pending'),
        'in_progress',  COUNT(*) FILTER (WHERE status = 'in_progress'),
        'completed',    COUNT(*) FILTER (WHERE status = 'completed')
      ) AS counts,
      COUNT(*) AS total
    FROM ordered;
  `;

    const { rows } = await db.query(sql, values);
    const row = rows[0] || { tasks: {}, counts: {}, total: 0 };

    return {
      tasks: {
        pending: row.tasks?.pending ?? [],
        in_progress: row.tasks?.in_progress ?? [],
        completed: row.tasks?.completed ?? [],
      },
      counts: {
        pending: Number(row.counts?.pending ?? 0),
        in_progress: Number(row.counts?.in_progress ?? 0),
        completed: Number(row.counts?.completed ?? 0),
      },
      total: Number(row.total ?? 0),
    };
  };

  protected createTaskDb = async (obj: ICreateTaskDbReqObj) => {
    const query = db.format(`INSERT INTO tasks ? RETURNING *`, obj);

    const { rows } = await db.query(query);
    return rows[0] as unknown as any;
  };

  public updateTaskByIdDb = async (obj: IUpdateTaskByIdDbObj) => {
    const { id, ...rest } = obj;

    const query = db.format(`UPDATE tasks SET ? WHERE id = $1`, rest);
    await db.query(query, [id]);
  };

  public updateTaskStatusByIdDb = async (obj: IUpdateTaskByIdDbObj) => {
    return this.updateTaskByIdDb(obj);
  };

  protected fetchTaskByIdDb = async (id: number) => {
    const query = `SELECT *
      FROM tasks
      WHERE id = $1 AND deleted_at IS NULL
      LIMIT 1
    `;

    const { rows } = await db.query(query, [id]);

    return rows[0] as unknown as ITaskByIdDbObj;
  };

  protected deleteTaskByIdDb = async (obj: {
    id: number;
    updated_by: number;
    updated_at: string;
  }) => {
    const { id, updated_by, updated_at } = obj;

    const query = `UPDATE tasks 
      SET deleted_at = $1, updated_by = $2, updated_at = $3 
      WHERE id = $4 AND deleted_at IS NULL`;

    await db.query(query, [updated_at, updated_by, updated_at, id]);
  };
}
