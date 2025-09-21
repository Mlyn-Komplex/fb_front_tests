import { useMutation } from "@tanstack/react-query";
import { getAuthToken, getUserInfo } from "@/api/auth";
import { useAuth } from "@/auth/AuthContext";

export const useGetAuthToken = () => {
  const { login } = useAuth();
  return useMutation({
    mutationFn: getAuthToken,
    onSuccess: async (data) => {
      const user = await getUserInfo(data);
      login(user, data);
      return data;
    },
  });
};
