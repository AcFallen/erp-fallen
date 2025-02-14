import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, User2 } from "lucide-react";
import { createUserSchema, CreateUserDTO } from "@/dtos/user.dto";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postUser } from "@/services/users/userService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { useCreateUser, useUpdateUser } from "@/mutations/userMutation";

interface UserFormProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UserForm({
  user,
  setUser,
  openForm,
  setOpenForm,
}: UserFormProps) {
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateUserDTO>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(data: CreateUserDTO) {
    if (user) {
      updateUser(
        { id: user.id, data },
        {
          onSuccess: () => {
            setOpenForm(false);
          }, 
        }
      );
    } else {
      createUser(data, {
        onSuccess: () => {
          setOpenForm(false);
        },
      });
    }
  }

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: undefined,
      });
    }
  }, [user]);

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      <DialogTrigger asChild>
        <Button>
          <User2 className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[calc(100vw-32px)] sm:max-w-[425px]"
        hiddenCloseIcon
        onCloseAutoFocus={() => {
          reset({
            name: "",
            email: "",
            password: "",
            role: undefined,
          });
          setUser(null);
        }}
      >
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        <DialogHeader>
          <DialogTitle>Crear Usuario</DialogTitle>
          <DialogDescription>
            Este formulario permite crear un nuevo usuario.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Nombre:</Label>
            <Input {...register("name")} id="name" placeholder="Nombre" />
            {errors.name && (
              <p className="mt-2 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email:</Label>
            <Input {...register("email")} id="email" placeholder="Email" />
            {errors.email && (
              <p className="mt-2 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Contraseña:</Label>
            <Input
              {...register("password")}
              id="password"
              placeholder="******"
            />
            {errors.password && (
              <p className="mt-2 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="rol">Rol:</Label>

            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="GUEST">Invitado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.role && (
              <p className="mt-2 text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">
              <Save className=" h-4 w-4" />
              {user ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
