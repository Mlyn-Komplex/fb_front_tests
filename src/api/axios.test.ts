// Global test functions are now available without imports

// Mock axios before importing the module
const mockAxiosInstance = {
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
    },
    response: {
      use: vi.fn(),
    },
  },
};

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock global localStorage
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("axios.ts", () => {
  let interceptorFunction: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Import the module once to set up the interceptor
    await import("./axios");

    // Get the interceptor function that was registered
    if (mockAxiosInstance.interceptors.request.use.mock.calls.length > 0) {
      interceptorFunction =
        mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    }
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("api instance creation", () => {
    it("should create axios instance with correct baseURL", async () => {
      const axios = await import("axios");
      expect(axios.default.create).toHaveBeenCalledWith({
        baseURL: "http://0.0.0.0:8000/",
      });
    });
  });

  describe("request interceptor", () => {
    it("should add Authorization header when token exists in localStorage", () => {
      const mockToken = {
        access_token: "test-access-token",
        token_type: "Bearer",
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockToken));

      const mockConfig = {
        headers: {},
        url: "/test",
        method: "get",
      };

      // Call the interceptor function
      const result = interceptorFunction(mockConfig);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("token");
      expect(result.headers.Authorization).toBe("Bearer test-access-token");
    });

    it("should not add Authorization header when no token exists", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const mockConfig = {
        headers: {},
        url: "/test",
        method: "get",
      };

      const result = interceptorFunction(mockConfig);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("token");
      expect(result.headers.Authorization).toBeUndefined();
    });

    it("should handle invalid JSON in localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid-json");

      const mockConfig = {
        headers: {},
        url: "/test",
        method: "get",
      };

      // This should throw an error due to invalid JSON
      expect(() => interceptorFunction(mockConfig)).toThrow();
    });

    it("should handle empty string in localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue("");

      const mockConfig = {
        headers: {},
        url: "/test",
        method: "get",
      };

      const result = interceptorFunction(mockConfig);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("token");
      expect(result.headers.Authorization).toBeUndefined();
    });

    it("should handle token without access_token property", () => {
      const mockToken = {
        token_type: "Bearer",
        // missing access_token
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockToken));

      const mockConfig = {
        headers: {},
        url: "/test",
        method: "get",
      };

      const result = interceptorFunction(mockConfig);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("token");
      expect(result.headers.Authorization).toBe("Bearer undefined");
    });

    it("should preserve existing headers", () => {
      const mockToken = {
        access_token: "test-access-token",
        token_type: "Bearer",
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockToken));

      const mockConfig = {
        headers: {
          "Content-Type": "application/json",
          "Custom-Header": "custom-value",
        },
        url: "/test",
        method: "post",
      };

      const result = interceptorFunction(mockConfig);

      expect(result.headers).toEqual({
        "Content-Type": "application/json",
        "Custom-Header": "custom-value",
        Authorization: "Bearer test-access-token",
      });
    });
  });
});
