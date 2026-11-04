import axios from "axios";
import { useState } from "react";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
} from "../models/BikeModel";

export const BIKES_PAGE_SIZE = 10;

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (requestedPage: number = page) => {
    setIsLoading(true);
    return axios
      .get<BikesPageModel>("http://localhost:3000/bikes", {
        params: { page: requestedPage, limit: BIKES_PAGE_SIZE },
      })
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
        setPage(requestedPage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Returns the request so the caller can react to errors (e.g. bike already sold)
  const deleteBike = (id: string) =>
    axios.delete(`http://localhost:3000/bikes/${id}`).then(() => {
      load(bikes.length === 1 && page > 1 ? page - 1 : page);
    });

  const createBike = (input: CreateBikeModel) =>
    axios
      .post<BikeModel>("http://localhost:3000/bikes", input)
      .then(() => load());

  return {
    bikes,
    totalCount,
    page,
    load,
    isLoading,
    deleteBike,
    createBike,
  };
};
