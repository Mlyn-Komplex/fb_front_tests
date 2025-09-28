// App.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

function renderWithRouter(initialEntries: string[]) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("App", () => {
  it("renders login page at /login", () => {
    renderWithRouter(["/login"]);
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
  });

  it("renders register page at /register", () => {
    renderWithRouter(["/register"]);
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  });

  it("blocks home page if not authenticated", () => {
    renderWithRouter(["/"]);
    expect(screen.queryByText(/home/i)).not.toBeInTheDocument();
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
  });
});
