import { postUser } from "@/services/users/userService";
import { User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => {
        return oldUsers ? [newUser, ...oldUsers] : [newUser];
      });

      toast.success("Usuario creado correctamente");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al crear el usuario");
    },
  });
};
