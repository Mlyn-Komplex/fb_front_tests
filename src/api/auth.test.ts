import type { Token } from "@/auth/AuthContext";

// Mock the axios module
const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
};

vi.mock("./axios", () => ({
  api: mockApi,
}));

describe("auth.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("registerUser", () => {
    it("should register a user successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          username: "testuser",
        },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { registerUser } = await import("./auth");
      const credentials = {
        username: "testuser",
        password: "password123",
      };

      const result = await registerUser(credentials);

      expect(mockApi.post).toHaveBeenCalledWith("/users/register", credentials);
      expect(result).toEqual({
        id: 1,
        username: "testuser",
      });
    });

    it("should handle registration errors", async () => {
      const error = new Error("Registration failed");
      mockApi.post.mockRejectedValue(error);

      const { registerUser } = await import("./auth");
      const credentials = {
        username: "testuser",
        password: "password123",
      };

      await expect(registerUser(credentials)).rejects.toThrow(
        "Registration failed"
      );
      expect(mockApi.post).toHaveBeenCalledWith("/users/register", credentials);
    });
  });

  describe("getAuthToken", () => {
    it("should get auth token successfully", async () => {
      const mockResponse = {
        data: {
          access_token: "mock-access-token",
          token_type: "Bearer",
        },
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const { getAuthToken } = await import("./auth");
      const credentials = {
        username: "testuser",
        password: "password123",
      };

      const result = await getAuthToken(credentials);

      // Check that URLSearchParams was used correctly
      expect(mockApi.post).toHaveBeenCalledWith(
        "/auth/token",
        expect.any(URLSearchParams)
      );

      // Verify the URLSearchParams content
      const callArgs = mockApi.post.mock.calls[0];
      const params = callArgs[1] as URLSearchParams;
      expect(params.get("username")).toBe("testuser");
      expect(params.get("password")).toBe("password123");
      expect(params.get("grant_type")).toBe("password");

      expect(result).toEqual({
        access_token: "mock-access-token",
        token_type: "Bearer",
      });
    });

    it("should handle authentication errors", async () => {
      const error = new Error("Authentication failed");
      mockApi.post.mockRejectedValue(error);

      const { getAuthToken } = await import("./auth");
      const credentials = {
        username: "testuser",
        password: "wrongpassword",
      };

      await expect(getAuthToken(credentials)).rejects.toThrow(
        "Authentication failed"
      );
      expect(mockApi.post).toHaveBeenCalledWith(
        "/auth/token",
        expect.any(URLSearchParams)
      );
    });
  });

  describe("getUserInfo", () => {
    it("should get user info successfully", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      const mockResponse = {
        data: mockUser,
      };

      mockApi.get.mockResolvedValue(mockResponse);

      const { getUserInfo } = await import("./auth");
      const token: Token = {
        access_token: "mock-access-token",
        token_type: "Bearer",
      };

      const result = await getUserInfo(token);

      expect(mockApi.get).toHaveBeenCalledWith("/users/me", {
        headers: { Authorization: "Bearer mock-access-token" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should handle user info errors", async () => {
      const error = new Error("Failed to get user info");
      mockApi.get.mockRejectedValue(error);

      const { getUserInfo } = await import("./auth");
      const token: Token = {
        access_token: "invalid-token",
        token_type: "Bearer",
      };

      await expect(getUserInfo(token)).rejects.toThrow(
        "Failed to get user info"
      );
      expect(mockApi.get).toHaveBeenCalledWith("/users/me", {
        headers: { Authorization: "Bearer invalid-token" },
      });
    });

    it("should handle empty token", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      const mockResponse = {
        data: mockUser,
      };

      mockApi.get.mockResolvedValue(mockResponse);

      const { getUserInfo } = await import("./auth");
      const token: Token = {
        access_token: "",
        token_type: "Bearer",
      };

      const result = await getUserInfo(token);

      expect(mockApi.get).toHaveBeenCalledWith("/users/me", {
        headers: { Authorization: "Bearer " },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
