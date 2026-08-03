import { create } from "zustand";

interface SeriesInfoModalStoreInterface {
  seriesId?: string;
  isOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
}

const useSeriesInfoModalStore = create<SeriesInfoModalStoreInterface>(
  (set) => ({
    seriesId: undefined,
    isOpen: false,

    openModal: (id: string) =>
      set({
        isOpen: true,
        seriesId: id,
      }),

    closeModal: () =>
      set({
        isOpen: false,
        seriesId: undefined,
      }),
  }),
);

export default useSeriesInfoModalStore;
