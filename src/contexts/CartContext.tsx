import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import CartService, {
  CartItemRequest,
  CartResponse,
  CartItemResponse,
} from "../services/cart.service";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity: number
  ) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
  totalItems: number;
  subtotal: number;
  refreshCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Convert API cart response to our CartItem format
  const mapResponseToCartItems = (response: CartResponse): CartItem[] => {
    if (!response.items || response.items.length === 0) {
      return [];
    }

    return response.items.map((item) => ({
      id: item.bookId,
      title: item.title,
      author: item.author,
      price: Number(item.price),
      quantity: item.quantity,
      imageUrl: item.imageUrl || "https://via.placeholder.com/400",
    }));
  };

  // Fetch the user's cart when authenticated
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await CartService.getUserCart();
      setItems(mapResponseToCartItems(response));
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setError("Failed to load your cart. Please try again.");
      // If API fails, don't clear the cart to prevent data loss
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Refresh cart data
  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (item: Omit<CartItem, "quantity">, quantity: number) => {
      setLoading(true);
      setError(null);

      try {
        const cartItemRequest: CartItemRequest = {
          bookId: item.id,
          quantity: quantity,
        };

        const response = await CartService.addItemToCart(cartItemRequest);
        setItems(mapResponseToCartItems(response));
      } catch (err: any) {
        console.error("Error adding item to cart:", err);
        setError("Failed to add item to cart. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeItem = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await CartService.removeItemFromCart(id);
      setItems(mapResponseToCartItems(response));
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item from cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(
    async (id: number, quantity: number) => {
      if (quantity < 1) {
        await removeItem(id);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await CartService.updateItemQuantity(id, quantity);
        setItems(mapResponseToCartItems(response));
      } catch (err: any) {
        console.error("Error updating cart quantity:", err);
        setError("Failed to update quantity. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [removeItem]
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await CartService.clearCart();
      setItems([]);
    } catch (err: any) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      loading,
      error,
      totalItems,
      subtotal,
      refreshCart,
      fetchCart,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      loading,
      error,
      totalItems,
      subtotal,
      refreshCart,
      fetchCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
