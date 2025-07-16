import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  IconButton,
  InputAdornment,
  Slider,
  Button,
  Chip,
  Collapse,
  Paper,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { validateSearchQuery } from "../../utils/validation";

export interface BookFilterProps {
  searchTerm: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const BookFilter = ({
  searchTerm,
  category,
  onSearchChange,
  onCategoryChange,
}: BookFilterProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = useState("relevance");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchError, setSearchError] = useState("");

  // Validate search input
  const handleSearchChange = (value: string) => {
    if (value.length > 0) {
      const validation = validateSearchQuery(value);
      if (!validation.isValid) {
        setSearchError(validation.error);
        return;
      }
    }
    setSearchError("");
    onSearchChange(value);
  };

  // Add or remove active filters
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const clearFilters = () => {
    setSearchError("");
    onSearchChange("");
    onCategoryChange("all");
    setPriceRange([0, 100]);
    setSortBy("relevance");
    setActiveFilters([]);
  };

  // Update active filters when props change
  useEffect(() => {
    const newFilters: string[] = [];
    if (searchTerm) newFilters.push("search");
    if (category !== "all") newFilters.push("category");
    if (priceRange[0] > 0 || priceRange[1] < 100) newFilters.push("price");
    if (sortBy !== "relevance") newFilters.push("sort");

    setActiveFilters(newFilters);
  }, [searchTerm, category, priceRange, sortBy]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    onCategoryChange(event.target.value);
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  return (
    <Paper elevation={2}>
      <Box
        sx={{
          mb: 2,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        {/* Basic Search Bar */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label="Search books"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            error={!!searchError}
            helperText={searchError}
            sx={{ flexGrow: 1, minWidth: "250px" }}
            placeholder="Enter book title, author or keyword"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => {
                      setSearchError("");
                      onSearchChange("");
                    }}
                    edge="end"
                    size="small"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: "200px" }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Microeconomics">Microeconomics</MenuItem>
              <MenuItem value="Macroeconomics">Macroeconomics</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{ minWidth: 140 }}
          >
            {showAdvanced ? "Less filters" : "More filters"}
          </Button>
        </Box>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {searchTerm && (
              <Chip
                label={`Search: "${
                  searchTerm.length > 15
                    ? searchTerm.substring(0, 15) + "..."
                    : searchTerm
                }"`}
                onDelete={() => onSearchChange("")}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {category !== "all" && (
              <Chip
                label={`Category: ${category}`}
                onDelete={() => onCategoryChange("all")}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {(priceRange[0] > 0 || priceRange[1] < 100) && (
              <Chip
                label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                onDelete={() => setPriceRange([0, 100])}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {sortBy !== "relevance" && (
              <Chip
                label={`Sort by: ${
                  sortBy.charAt(0).toUpperCase() + sortBy.slice(1)
                }`}
                onDelete={() => setSortBy("relevance")}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {activeFilters.length > 1 && (
              <Button
                size="small"
                onClick={clearFilters}
                sx={{ ml: "auto" }}
                startIcon={<Clear fontSize="small" />}
              >
                Clear all
              </Button>
            )}
          </Box>
        )}

        {/* Advanced Filters */}
        <Collapse in={showAdvanced}>
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Price Range
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: "$0" },
                  { value: 50, label: "$50" },
                  { value: 100, label: "$100+" },
                ]}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Sort By
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label="Relevance"
                  onClick={() => setSortBy("relevance")}
                  variant={sortBy === "relevance" ? "filled" : "outlined"}
                  color={sortBy === "relevance" ? "primary" : "default"}
                  sx={{ mb: 1 }}
                />
                <Chip
                  label="Price: Low to High"
                  onClick={() => setSortBy("price_asc")}
                  variant={sortBy === "price_asc" ? "filled" : "outlined"}
                  color={sortBy === "price_asc" ? "primary" : "default"}
                  sx={{ mb: 1 }}
                />
                <Chip
                  label="Price: High to Low"
                  onClick={() => setSortBy("price_desc")}
                  variant={sortBy === "price_desc" ? "filled" : "outlined"}
                  color={sortBy === "price_desc" ? "primary" : "default"}
                  sx={{ mb: 1 }}
                />
                <Chip
                  label="Newest First"
                  onClick={() => setSortBy("newest")}
                  variant={sortBy === "newest" ? "filled" : "outlined"}
                  color={sortBy === "newest" ? "primary" : "default"}
                  sx={{ mb: 1 }}
                />
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};
