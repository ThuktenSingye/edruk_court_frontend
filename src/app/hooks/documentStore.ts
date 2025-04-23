// store/documentStore.ts
import { create } from 'zustand';

interface DocumentState {
    sharedDocument: any | null;
    setSharedDocument: (doc: any) => void;
    clearSharedDocument: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
    sharedDocument: null,
    setSharedDocument: (doc) => set({ sharedDocument: doc }),
    clearSharedDocument: () => set({ sharedDocument: null }),
}));