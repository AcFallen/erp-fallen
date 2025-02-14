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

export const patchUser = async (id: string, data: Partial<User>) => {
  const response = await axiosClient.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosClient.delete(`/users/${id}`);
  return response.data;
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
