import { deleteUser, patchUser, postUser } from "@/services/users/userService";
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      patchUser(id, data),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => {
        return oldUsers
          ? oldUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
          : [updatedUser];
      });

      toast.success("Usuario actualizado correctamente");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Error al actualizar el usuario");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),

    onSuccess: (_, id) => {
      queryClient.setQueryData(["users"], (oldUsers: User[] | undefined) => {
        return oldUsers ? oldUsers.filter((user) => user.id !== id) : [];
      });

      toast.success("Usuario eliminado correctamente");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Error al eliminar el usuario");
    },
  });
};
