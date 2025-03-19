import { Pageable } from "../types/pageable";

export class ResponseHelpers {
  static success<T>(message: string, data: T) {
    return {
      message: message,
      data: data,
    };
  }

  static successWithPagination<T>(
    message: string,
    { data, paging }: Pageable<T>
  ) {
    return {
      message: message,
      data: data,
      paging: paging,
    };
  }

  static error(message: string, errors: string[] | string) {
    return {
      message: message,
      errors: errors,
    };
  }
}
