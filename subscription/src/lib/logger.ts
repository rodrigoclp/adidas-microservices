// import from an external lib

export interface Logger {
  error: (msg: string) => void
  info: (msg: string) => void
}

const logger = {
  error: (msg: string): void => console.error(msg),
  info: (msg: string): void => console.log(msg)
};

export default logger;
