import { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import {
  Dashboard,
  MenuBook,
  ShoppingCart,
  BarChart,
} from "@mui/icons-material";
import { SalesAnalytics } from "./SalesAnalytics";
import { BookManagement } from "./BookManagement";
import { OrderManagement } from "./OrderManagement";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="admin dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<BarChart />} label="Sales Analytics" />
            <Tab icon={<MenuBook />} label="Book Management" />
            <Tab icon={<ShoppingCart />} label="Order Management" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <SalesAnalytics />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <BookManagement />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <OrderManagement />
        </TabPanel>
      </Paper>
    </Box>
  );
};
