import axiosClient from "@/lib/axios-client";
import { User } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get("/users");
  const sortedUsers = response.data.sort((a: User, b: User) =>
    a.updatedAt > b.updatedAt ? -1 : 1
  );
  return sortedUsers;
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

export const postUser = async (data: Partial<User>) => {
  try {
    const response = await axiosClient.post("/users", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }
};
