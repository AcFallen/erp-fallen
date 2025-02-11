"use client";
import { DataTable } from "@/components/data-table";
import { getUsers } from "@/services/users/userService";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { getUserColumns } from "@/components/modules/users/user-columns";
import { UserForm } from "@/components/modules/users/user-form";

const UserPage = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 5,
  });

  const columns = useMemo<ColumnDef<User>[]>(() => getUserColumns(), []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <UserForm />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <DataTable columns={columns} data={users || []} />
      </div>
    </>
  );
};

export default UserPage;
