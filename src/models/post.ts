import type { MDXInstance } from "astro";
import { ResourceBase } from "./resource";

export class Post extends ResourceBase {
  public readonly tags: string[];

  public constructor(data: MDXInstance<Record<string, any>>) {
    super(data);

    if (
      !("tags" in data.frontmatter) ||
      !Array.isArray(data.frontmatter?.tags)
    ) {
      throw new Error(
        `tags must be an array of string, ${typeof data.frontmatter
          .tags} was passed`,
      );
    }

    this.tags = data.frontmatter.tags;
  }

  public static async fromGlob(
    glob: Record<string, any> | MDXInstance<Record<string, any>>[],
    limit?: number,
  ): Promise<Post[]> {
    // Handle both object (from import.meta.glob) and array formats
    const items = Array.isArray(glob) ? glob : Object.values(glob);
    const posts = items
      .map((p) => new Post(p))
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));
    return ResourceBase.sortByDate(posts).slice(0, limit);
  }
}
