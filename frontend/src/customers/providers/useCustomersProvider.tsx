import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
  CustomersPageModel,
} from "../models/CustomerModel";

export const CUSTOMERS_PAGE_SIZE = 10;

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (requestedPage: number = page) => {
    setIsLoading(true);
    return axios
      .get<CustomersPageModel>("http://localhost:3000/customers", {
        params: { page: requestedPage, limit: CUSTOMERS_PAGE_SIZE },
      })
      .then((result) => {
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
        setPage(requestedPage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCustomer = (id: string) => {
    axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
      // Go back one page when the last customer of the page has been deleted
      load(customers.length === 1 && page > 1 ? page - 1 : page);
    });
  };

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then(() => load());

  return {
    customers,
    totalCount,
    page,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};
