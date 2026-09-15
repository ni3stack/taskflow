import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const ThrowError = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>TaskFlow content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("TaskFlow content")).toBeInTheDocument();
  });

  it.skip("renders fallback UI when a child throws an error", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
      {
        onCaughtError: () => {},
      }
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    expect(
      screen.getByText("We couldn't load this page. Please try again.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
    consoleError.mockRestore();
  });
});