export interface PaginatedParams {
  pageSize?: number;
  last?: string;
  first?: string;
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
  direction?: "next" | "prev";
}

export type DirectionType = "next" | "prev" | undefined;
