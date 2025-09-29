import { describe, it, expect, vi } from "vitest";
import { cn, formatTimeAgo } from "./utils"; // adjust the path

describe("cn()", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2", "text-sm")).toBe("px-2 text-sm");
  });

  it("handles conditional class names", () => {
    expect(cn("base", false && "hidden", true && "block")).toBe("base block");
  });

  it("applies tailwind-merge conflict resolution", () => {
    // px-2 and px-4 conflict → twMerge keeps the latter
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles empty or null values", () => {
    expect(cn("", null, undefined, "mt-2")).toBe("mt-2");
  });
});

describe("formatTimeAgo()", () => {
  beforeEach(() => {
    // mock system time so tests are stable
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-01-01T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'just now' for less than 60 seconds ago", () => {
    const date = new Date("2023-01-01T11:59:45Z").toISOString();
    expect(formatTimeAgo(date)).toBe("just now");
  });

  it("returns minutes ago for under 60 minutes", () => {
    const date = new Date("2023-01-01T11:45:00Z").toISOString();
    expect(formatTimeAgo(date)).toBe("15m ago");
  });

  it("returns hours ago for under 24 hours", () => {
    const date = new Date("2023-01-01T08:00:00Z").toISOString();
    expect(formatTimeAgo(date)).toBe("4h ago");
  });

  it("returns days ago for under 7 days", () => {
    const date = new Date("2022-12-30T12:00:00Z").toISOString();
    expect(formatTimeAgo(date)).toBe("2d ago");
  });

  it("returns formatted date for over 7 days", () => {
    const date = new Date("2022-12-20T12:00:00Z").toISOString();
    expect(formatTimeAgo(date)).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
  });
});
