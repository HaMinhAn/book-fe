// This file contains custom type declarations to fix compatibility issues

// Augment the @mui/material module
declare module "@mui/material/Grid" {
  interface GridProps {
    item?: boolean;
    container?: boolean;
  }
}
