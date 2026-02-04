import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClientList from "../../../components/resume/ClientList";
import { ThemeContextProvider } from "../../../contexts/ThemeContext";

/**
 * Tests for the ClientList component.
 * Verifies the client display in a grid with chips.
 */

/**
 * Wrapper component that provides ThemeContext to tested components.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the theme context
 * @returns The children wrapped with ThemeContextProvider
 */
function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}
describe("ClientList", () => {
  const mockClients = [
    "Microsoft",
    "Google",
    "Amazon",
    "Apple",
    "Meta",
    "Tesla",
  ];

  it("should render the Clients heading", () => {
    render(<ClientList clients={mockClients} />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /clients/i, level: 3 })
    ).toBeInTheDocument();
  });

  it("should render all client names", () => {
    render(<ClientList clients={mockClients} />, { wrapper: Wrapper });

    expect(screen.getByText("Microsoft")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Amazon")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Meta")).toBeInTheDocument();
    expect(screen.getByText("Tesla")).toBeInTheDocument();
  });

  it("should render correct number of clients", () => {
    const { container } = render(<ClientList clients={mockClients} />, { wrapper: Wrapper });

    const chips = container.querySelectorAll('[class*="MuiChip-root"]');
    expect(chips).toHaveLength(6);
  });

  it("should have proper accessibility attributes", () => {
    render(<ClientList clients={mockClients} />, { wrapper: Wrapper });

    const section = screen.getByRole("region", { name: /clients/i });
    expect(section).toBeInTheDocument();
  });

  it("should render with single client", () => {
    const singleClient = ["Single Client"];

    render(<ClientList clients={singleClient} />, { wrapper: Wrapper });

    expect(screen.getByText("Single Client")).toBeInTheDocument();
  });

  it("should render with empty clients array", () => {
    render(<ClientList clients={[]} />, { wrapper: Wrapper });

    // Should still render the heading
    expect(
      screen.getByRole("heading", { name: /clients/i, level: 3 })
    ).toBeInTheDocument();

    const { container } = render(<ClientList clients={[]} />, { wrapper: Wrapper });
    const chips = container.querySelectorAll('[class*="MuiChip-root"]');
    expect(chips).toHaveLength(0);
  });

  it("should render with many clients", () => {
    const manyClients = Array.from({ length: 50 }, (_, i) => `Client ${i + 1}`);

    render(<ClientList clients={manyClients} />, { wrapper: Wrapper });

    expect(screen.getByText("Client 1")).toBeInTheDocument();
    expect(screen.getByText("Client 25")).toBeInTheDocument();
    expect(screen.getByText("Client 50")).toBeInTheDocument();
  });

  it("should render clients with special characters", () => {
    const specialClients = [
      "AT&T",
      "3M Company",
      "O'Reilly Media",
      "Ben & Jerry's",
    ];

    render(<ClientList clients={specialClients} />, { wrapper: Wrapper });

    expect(screen.getByText("AT&T")).toBeInTheDocument();
    expect(screen.getByText("3M Company")).toBeInTheDocument();
    expect(screen.getByText("O'Reilly Media")).toBeInTheDocument();
    expect(screen.getByText("Ben & Jerry's")).toBeInTheDocument();
  });
});
