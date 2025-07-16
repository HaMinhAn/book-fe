import api from "./api";

// Analytics service interfaces
export interface MonthlySales {
  month: string;
  revenue: number;
  orderCount: number;
  booksSold: number;
}

export interface TopSellingBook {
  bookId: number;
  title: string;
  author: string;
  quantitySold: number;
  revenue: number;
}

export interface CategorySales {
  category: string;
  booksSold: number;
  revenue: number;
  orderCount: number;
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalBooksSold: number;
  averageOrderValue: number;
  monthlySales: MonthlySales[];
  topSellingBooks: TopSellingBook[];
  categorySales: CategorySales[];
  orderStatusDistribution: Record<string, number>;
}

// Analytics service methods
const AnalyticsService = {
  getSalesAnalytics: async (): Promise<SalesAnalytics> => {
    try {
      console.log("Fetching sales analytics");
      const response = await api.get("/admin/analytics/sales");
      console.log("Analytics fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },
};

export default AnalyticsService;
