"use client";
import { DataTable } from "@/components/data-table";
import { getUsers } from "@/services/users/userService";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { getUserColumns } from "@/components/modules/users/user-columns";
import { UserForm } from "@/components/modules/users/user-form";
import { UserDeleteModal } from "@/components/modules/users/user-delete-modal";

const UserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

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
    () => getUserColumns({ setUser, setOpenForm, setOpenDelete }),
    []
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <UserForm
          user={user}
          setUser={setUser}
          openForm={openForm}
          setOpenForm={setOpenForm}
        />
      </div>
      <UserDeleteModal open={openDelete} setOpen={setOpenDelete} user={user} />
      <div className="grid grid-cols-1 gap-4">
        <DataTable columns={columns} data={users || []} />
      </div>
    </>
  );
};

export default UserPage;
