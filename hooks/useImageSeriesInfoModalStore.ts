import { create } from "zustand";

interface ImageSeriesInfoModalStore {
  isOpen: boolean;
  imageSeriesId?: string;
  openModal: (imageSeriesId: string) => void;
  closeModal: () => void;
}

const useImageSeriesInfoModalStore = create<ImageSeriesInfoModalStore>(
  (set) => ({
    isOpen: false,
    imageSeriesId: undefined,

    openModal: (imageSeriesId) =>
      set({
        isOpen: true,
        imageSeriesId,
      }),

    closeModal: () =>
      set({
        isOpen: false,
        imageSeriesId: undefined,
      }),
  }),
);

export default useImageSeriesInfoModalStore;
