// Shim for missing inngest exports
// This file provides exports that @inngest/agent-kit expects from inngest package

export class InngestFunction {
  constructor(public config: any) {}
}

export const serializeError = (error: any) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return error;
};
