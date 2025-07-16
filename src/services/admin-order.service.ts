import api from "./api";
import { OrderResponse, PagedResponse } from "./order.service";

// Admin filter interface
export interface AdminOrderFilter {
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: number;
}

// Admin service for order management
const AdminOrderService = {
  getAllOrders: async (
    filter: AdminOrderFilter = {},
    page = 0,
    size = 10
  ): Promise<PagedResponse<OrderResponse>> => {
    try {
      console.log("Fetching filtered orders (admin)");

      // Build query params
      let queryParams = new URLSearchParams();

      if (filter.status) queryParams.append("status", filter.status);
      if (filter.startDate) queryParams.append("startDate", filter.startDate);
      if (filter.endDate) queryParams.append("endDate", filter.endDate);
      if (filter.minAmount)
        queryParams.append("minAmount", filter.minAmount.toString());
      if (filter.maxAmount)
        queryParams.append("maxAmount", filter.maxAmount.toString());
      if (filter.userId) queryParams.append("userId", filter.userId.toString());

      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      const url = `/admin/orders?${queryParams.toString()}`;
      console.log("Requesting URL:", url);

      const response = await api.get(url);
      console.log("Orders fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  getOrderById: async (orderId: number): Promise<OrderResponse> => {
    try {
      console.log(`Fetching order ${orderId} (admin)`);
      const response = await api.get(`/admin/orders/${orderId}`);
      console.log("Order fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching order ${orderId}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  updateOrderStatus: async (
    orderId: number,
    status: string
  ): Promise<OrderResponse> => {
    try {
      console.log(`Updating order ${orderId} status to ${status}`);
      const response = await api.put(
        `/admin/orders/${orderId}/status?status=${status}`
      );
      console.log("Order status updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating order ${orderId} status:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },
};

export default AdminOrderService;
