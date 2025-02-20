"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Phone, Map } from "lucide-react";
import { createPerfilSchema, PerfilSchema } from "@/schemas/perfilSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axiosClient from "@/lib/axios-client";
import { useProfileStore } from "@/store/profile-store";

export default function ProfileForm() {
  const { data: session } = useSession();
  const { profile } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PerfilSchema>({
    resolver: zodResolver(createPerfilSchema),
    defaultValues: {
      userId: session?.user.id,
      avatar: profile?.avatar || "",
      bio: profile?.bio || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  });

  const {
    ref: avatarRef,
    onChange: avatarOnChange,
    ...avatarRest
  } = register("avatar");

  // Función para manejar el cambio del input file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Llamar al onChange de RHF
    avatarOnChange(e);

    const file = e.target.files && e.target.files[0];
    if (file) {
      // Actualizar la previsualización
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(data: PerfilSchema) {
    const formData = new FormData();
    formData.append("userId", data.userId);
    formData.append("bio", data.bio);
    formData.append("phone", data.phone);
    formData.append("address", data.address);

    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      const response = await axiosClient.post("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Perfil actualizado:", response.data);
    } catch (error) {
      console.error("Error al actualizar perfil", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-24 h-24">
          {/* Muestra la imagen seleccionada o la de placeholder */}
          <AvatarImage
            src={`/api/files/${encodeURIComponent(profile?.avatar || "")}`}
            alt="Avatar"
          />
          <AvatarFallback>FN</AvatarFallback>
        </Avatar>
        <div>
          <Button
            variant="outline"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Cambia Avatar
          </Button>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            style={{ opacity: 0, position: "absolute", zIndex: -1 }}
            // Combina el ref de RHF y el tuyo
            {...avatarRest}
            onChange={handleFileChange}
            ref={(e) => {
              avatarRef(e);
              fileInputRef.current = e;
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Descripcion</Label>
        <div className="relative">
          <FileText className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
          <Textarea
            {...register("bio")}
            id="bio"
            className="pl-9 min-h-[100px]"
          />
        </div>
        {errors.bio && (
          <p className="mt-2 text-xs text-red-500">
            {errors.bio.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Celular</Label>
        <div className="relative">
          <Phone className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
          <Input {...register("phone")} className="pl-9" />
        </div>
        {errors.phone && (
          <p className="mt-2 text-xs text-red-500">
            {errors.phone.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Direccion</Label>
        <div className="relative">
          <Map className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
          <Input {...register("address")} className="pl-9" />
        </div>
        {errors.address && (
          <p className="mt-2 text-xs text-red-500">
            {errors.address.message as string}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Guardar Cambios
      </Button>
    </form>
  );
}
