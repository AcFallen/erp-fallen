import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserColumnsProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

export const getUserColumns = ({
  setUser,
  setOpenForm,
  setOpenDelete,
}: UserColumnsProps): ColumnDef<User>[] => [
  {
    header: "#",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => (
      <Badge variant={row.getValue("role") === "ADMIN" ? "success" : "default"}>
        {row.getValue("role")}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => (
      <span>
        {format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm:ss")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Actualizado por última vez",
    cell: ({ row }) => (
      <span>
        {format(new Date(row.original.updatedAt), "dd/MM/yyyy HH:mm:ss")}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="warning"
                onClick={() => {
                  setUser(row.original), setOpenForm(true);
                }}
                size={"icon"}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent variant={"warning"}>
              <p>Editar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  setOpenDelete(true), setUser(row.original);
                }}
                size={"icon"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent variant={"destructive"}>
              <p>Eliminar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
];
