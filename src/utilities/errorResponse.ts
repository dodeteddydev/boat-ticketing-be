export class ErrorResponse extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors: string
  ) {
    super(message);
  }
}
