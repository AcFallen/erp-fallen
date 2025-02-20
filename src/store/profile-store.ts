import { Profile } from "@prisma/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

export const useProfileStore = create<
  ProfileStore,
  [["zustand/persist", ProfileStore]]
>(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile: Profile | null) => set({ profile }),
    }),
    {
      name: "profile-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
