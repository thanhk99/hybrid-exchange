import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { connectSpotSocket, closeSpotSocket } from "../lib/api/springboot-api/spotMarket";

export const useSpotSocket = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    connectSpotSocket(dispatch);

    return () => {
      closeSpotSocket();
    };
  }, [dispatch]);
};
