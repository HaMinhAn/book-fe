import api from "./api";

// Cart service interfaces
export interface CartItemRequest {
  bookId: number;
  quantity: number;
}

export interface CartRequest {
  items: CartItemRequest[];
}

export interface CartItemResponse {
  id: number;
  bookId: number;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  id: number;
  items: CartItemResponse[];
  totalPrice: number;
}

// Cart service methods
const CartService = {
  getUserCart: async (): Promise<CartResponse> => {
    try {
      console.log("Fetching user cart");
      const response = await api.get("/cart");
      console.log("Cart fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  updateCart: async (cartRequest: CartRequest): Promise<CartResponse> => {
    try {
      console.log("Updating cart:", cartRequest);
      const response = await api.post("/cart", cartRequest);
      console.log("Cart updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating cart:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  clearCart: async (): Promise<void> => {
    try {
      console.log("Clearing cart");
      await api.delete("/cart");
      console.log("Cart cleared successfully");
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  addItemToCart: async (item: CartItemRequest): Promise<CartResponse> => {
    try {
      console.log("Adding item to cart:", item);
      const response = await api.post("/cart/item", item);
      console.log("Item added to cart successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  removeItemFromCart: async (bookId: number): Promise<CartResponse> => {
    try {
      console.log(`Removing item with bookId ${bookId} from cart`);
      const response = await api.delete(`/cart/item/${bookId}`);
      console.log("Item removed from cart successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        `Error removing item with bookId ${bookId} from cart:`,
        error
      );
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  updateItemQuantity: async (
    bookId: number,
    quantity: number
  ): Promise<CartResponse> => {
    try {
      console.log(`Updating item ${bookId} quantity to ${quantity}`);
      const response = await api.put(`/cart/item/${bookId}`, { quantity });
      console.log("Item quantity updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating item ${bookId} quantity:`, error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },
};

export default CartService;
