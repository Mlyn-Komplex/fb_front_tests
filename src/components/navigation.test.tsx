// Navigation.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navigation from "./navigation";

// Mock useAuth
const logoutMock = vi.fn();
vi.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({ logout: logoutMock }),
}));

describe("Navigation", () => {
  it("renders logo", () => {
    render(<Navigation />);
    expect(screen.getByText("f")).toBeInTheDocument();
  });

  it("expands and collapses search bar on focus/blur", async () => {
    render(<Navigation />);
    const input = screen.getByPlaceholderText("Search here...");

    // Initially collapsed (parent div should have small width class)
    const container = input.closest("div")!;
    expect(container.className).toContain("w-40");

    // Focus expands
    await userEvent.click(input);
    expect(container.className).toContain("w-full");

    // Blur collapses
    fireEvent.blur(input);
    expect(container.className).toContain("w-40");
  });

  it("shows notification badge", () => {
    render(<Navigation />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("opens dropdown and shows menu items", async () => {
    render(<Navigation />);
    const avatarButton = screen.getByRole("button", { name: /U/i });

    // Open dropdown
    await userEvent.click(avatarButton);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls logout when clicking Logout", async () => {
    render(<Navigation />);
    const avatarButton = screen.getByRole("button", { name: /U/i });

    await userEvent.click(avatarButton);
    await userEvent.click(screen.getByText("Logout"));

    expect(logoutMock).toHaveBeenCalled();
  });
});
