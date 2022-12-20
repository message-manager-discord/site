import React from "react";

export enum APIStates {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export function useApi<ReturnType>(url: string) {
  const [data, setData] = React.useState({
    state: APIStates.LOADING,
    error: "",
    data: null as ReturnType | null,
  });

  const setPartData = (partialData: any) =>
    setData({ ...data, ...partialData });

  React.useEffect(() => {
    setPartData({
      state: APIStates.LOADING,
    });
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPartData({
          state: APIStates.SUCCESS,
          data,
        });
      })
      .catch(() => {
        setPartData({
          state: APIStates.ERROR,
          error: "fetch failed",
        });
      });
  }, []);

  return data;
}
