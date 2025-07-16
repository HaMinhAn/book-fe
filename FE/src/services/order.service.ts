import api from "./api";

// Order service interfaces
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

export interface OrderItem {
  bookId: number;
  quantity: number;
  price: number;
}

export interface OrderRequest {
  shippingInfo: ShippingInfo;
  paymentMethod: string;
}

export interface OrderResponse {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: {
    id: number;
    book: {
      id: number;
      title: string;
      author: string;
      price: number;
    };
    quantity: number;
    price: number;
  }[];
  shippingInfo: ShippingInfo;
  paymentMethod: string;
}

export interface OrderFilter {
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Order service methods
const OrderService = {
  createOrder: async (orderRequest: OrderRequest): Promise<OrderResponse> => {
    try {
      console.log("Creating order:", orderRequest);
      const response = await api.post("/orders", orderRequest);
      console.log("Order created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating order:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  getUserOrders: async (
    filter?: OrderFilter,
    pagination?: PaginationParams
  ): Promise<PagedResponse<OrderResponse> | OrderResponse[]> => {
    try {
      console.log(
        "Fetching user orders with filter:",
        filter,
        "and pagination:",
        pagination
      );

      // Build query parameters
      const params: Record<string, string> = {};

      // Add filter parameters if provided
      if (filter) {
        if (filter.status) params.status = filter.status;
        if (filter.startDate) params.startDate = filter.startDate;
        if (filter.endDate) params.endDate = filter.endDate;
        if (filter.minAmount) params.minAmount = filter.minAmount.toString();
        if (filter.maxAmount) params.maxAmount = filter.maxAmount.toString();
      }

      // Add pagination parameters if provided
      if (pagination) {
        params.page = pagination.page.toString();
        params.size = pagination.size.toString();
      }

      const response = await api.get("/orders", { params });
      console.log("Orders fetched successfully:", response.data);

      // If the response is paginated, it will have content property
      if (response.data.content) {
        return response.data as PagedResponse<OrderResponse>;
      }

      // If not paginated, return as array
      return response.data as OrderResponse[];
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
      console.log(`Fetching order with ID ${orderId}`);
      const response = await api.get(`/orders/${orderId}`);
      console.log("Order fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching order with ID ${orderId}:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  confirmOrderReceived: async (orderId: number): Promise<OrderResponse> => {
    try {
      console.log(`Confirming order ${orderId} has been received`);
      const response = await api.post(`/orders/${orderId}/confirm-received`);
      console.log("Order confirmed as received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error confirming order ${orderId} as received:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  // Admin methods
  getAllOrders: async (): Promise<OrderResponse[]> => {
    try {
      console.log("Fetching all orders (admin)");
      const response = await api.get("/admin/orders");
      console.log("All orders fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching all orders:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },
};

export default OrderService;
