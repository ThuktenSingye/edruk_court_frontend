// useDocumentStore.ts
import { create } from "zustand";

interface DocumentState {
    selectedDocument: any;
    setSelectedDocument: (doc: any) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
    selectedDocument: null,
    setSelectedDocument: (doc) => set({ selectedDocument: doc }),
}));
