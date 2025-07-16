import { forwardRef, ReactNode } from "react";
import { Grid as MuiGrid } from "@mui/material";

type GridProps = {
  children: ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  spacing?: number;
  [key: string]: any;
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ children, item, container, xs, sm, md, lg, spacing, ...props }, ref) => {
    // For MUI v7, we need to handle the size props differently
    const gridProps: any = {
      ref,
      container,
      ...props,
    };

    // Only add size props if it's an item (not a container)
    if (item && !container) {
      gridProps.size = {
        xs,
        sm,
        md,
        lg,
      };
    } else if (container) {
      gridProps.spacing = spacing;
    }

    return <MuiGrid {...gridProps}>{children}</MuiGrid>;
  }
);
