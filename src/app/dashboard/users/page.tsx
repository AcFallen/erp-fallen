"use client";
import { DataTable } from "@/components/data-table";
import { getUsers } from "@/services/users/userService";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span>{row.getValue("name")}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span>{row.getValue("email")}</span>,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant="default">{row.getValue("role")}</Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <span>
            {format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm:ss")}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => (
          <span>
            {format(new Date(row.original.updatedAt), "dd/MM/yyyy HH:mm:ss")}
          </span>
        ),
      },
    ],
    []
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <DataTable columns={columns} data={users || []} />
    </div>
  );
};

export default UserPage;
