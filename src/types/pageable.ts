export type Paging =
  | {
      size: number;
      totalPage: number;
      currentPage: number;
    }
  | undefined;

export type Pageable<T> = {
  data: Array<T>;
  paging: Paging;
};
