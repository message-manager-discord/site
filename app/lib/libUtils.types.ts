import { json } from "@remix-run/cloudflare";
interface ErrorReturn {
  error: true;
  response: Response;
}

type SeverFunctionReturnType<T> = ErrorReturn | T;

// type guard for ErrorReturn or anything else (error will be true)
function isErrorReturn(response: ErrorReturn | any): response is ErrorReturn {
  return response.error === true;
}

async function returnJSONIfOK<RType>(
  response: Response
): Promise<RType | ErrorReturn> {
  if (response.ok) {
    return (await response.json()) as RType;
  } else {
    return {
      error: true,
      response,
    };
  }
}

// Function to check if the returned is error - if it is then throw a response
// To be used in loaders / actions
async function checkIfErrorReturn<T>(response: ErrorReturn | T) {
  if (isErrorReturn(response)) {
    throw json(((await response.response.json()) as any).message, {
      status: response.response.status,
    });
  }
  return response;
}

export { isErrorReturn, returnJSONIfOK, checkIfErrorReturn };
export type { SeverFunctionReturnType, ErrorReturn };
