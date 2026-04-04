import { useEffect, useState } from "react";
import { loadCounsellingData } from "../lib/counsellingData";

const initialState = {
  data: null,
  loading: true,
  error: null,
};

export function useCounsellingData(datasetType = "ug") {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let active = true;

    loadCounsellingData(datasetType)
      .then((data) => {
        if (active) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: error.message,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [datasetType]);

  return state;
}
