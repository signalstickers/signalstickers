export default class ErrorWithCode extends Error {
  code: string;


  constructor(code: string | undefined, message: string) {
    super(message);
    this.code = code ?? 'UNKNOWN';
  }


  static from = (code: string, err: Error) => {
    const errWithCode = new ErrorWithCode(code, err.message);
    errWithCode.stack = err.stack;
    return errWithCode;
  };
}
