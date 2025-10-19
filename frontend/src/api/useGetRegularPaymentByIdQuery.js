import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient.js";

/**
 * Custom hook for fetching a regular payment by ID using React Query
 * @param {string} id - The ID of the regular payment to fetch
 * @param {Object} options - Additional query options
 * @returns {UseQueryResult} Query result object containing data, loading state, and error
 */
export function useGetRegularPaymentByIdQuery(id, params = {}) {
  return useQuery({
    queryKey: ["regularPayment", id],
    queryFn: async () => {
      const response = await apiClient({
        method: "get",
        url: `/regular-payments/${id}`,
      });
      return response.data.data;
    },
    enabled: !!id,
    ...params
  });
}
