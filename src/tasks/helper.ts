import TasksDb from "./db";

export default class TasksHelper extends TasksDb {
  //

  /**
   * Generate slug (total min 7 CHAR)
   * - first 3 CHAR from title (lowercase, alphanumeric, hyphen)
   * - 4 random CHAR (numeric)
   *
   * Example: "My Task Title" -> "mtt-1234"
   */

  protected generateSlug = (title: string) => {
    const titlePart = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
      .substring(0, 3)
      .toLocaleUpperCase(); // first 3 CHAR

    const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); // 4 random numeric CHAR

    return `${titlePart}-${randomPart}`;
  };
}
