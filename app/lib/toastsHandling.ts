import toast from "react-hot-toast";

type ServerResponseReturns<Response> = {
  response?: Response;
  toast?: {
    type: "success" | "error" | "loading";
    message: string;
  };
};
const parseResponseHandleToasts = async (
  response: ServerResponseReturns<any>
): Promise<void> => {
  if (response.toast) {
    toast[response.toast.type](response.toast.message);
  }
};

export { parseResponseHandleToasts };
export type { ServerResponseReturns };
