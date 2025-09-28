// ProtectedRoute.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import * as AuthModule from "@/auth/AuthContext"; // module that exports useAuth
import ProtectedRoute from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  it("redirects to login if no user", () => {
    vi.spyOn(AuthModule, "useAuth").mockReturnValue({
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Secret Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders children if user exists", () => {
    vi.spyOn(AuthModule, "useAuth").mockReturnValue({
      user: { id: 1, username: "Alice" },
      token: { access_token: "abc", token_type: "Bearer" },
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Secret Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Secret Page")).toBeInTheDocument();
  });

  it("shows loader when isLoading=true", () => {
    vi.spyOn(AuthModule, "useAuth").mockReturnValue({
      user: { id: 1, username: "Alice" },
      token: { access_token: "abc", token_type: "Bearer" },
      login: vi.fn(),
      logout: vi.fn(),
      isLoading: true,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Secret Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Secret Page")).not.toBeInTheDocument();
  });
});
