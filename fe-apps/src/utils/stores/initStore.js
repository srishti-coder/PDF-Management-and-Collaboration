import { create } from "zustand";

const useInitStore = create((set, get) => ({
  platform: window.innerWidth <= 1024 ? "mobile" : "desktop",
  handleWindowResize: () => {
    set({ platform: window.innerWidth <= 1024 ? "mobile" : "desktop" });
  },
}));

export default useInitStore;
