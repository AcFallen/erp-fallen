import axiosClient from "@/lib/axios-client";
import { User } from "@prisma/client";

export const getUsers = async (): Promise<User[]> => {
    const response = await axiosClient.get("/users");
    return response.data;
  };
  
  export const getUserById = async (id: string): Promise<User> => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  };
  
  export const updateUser = async (id: string, data: Partial<User>) => {
    return await axiosClient.put(`/users/${id}`, data);
  };
  
  export const deleteUser = async (id: string) => {
    return await axiosClient.delete(`/users/${id}`);
  };