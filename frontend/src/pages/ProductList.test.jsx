import { render, screen } from "@testing-library/react";
import ProductList from "./ProductList";

test("renders Product Listings heading", () => {
  render(<ProductList />);

  expect(
    screen.getByText(/Product Listings/i)
  ).toBeInTheDocument();
});