
import { create } from 'zustand';

interface Hearing {
    id: number;
    hearing_status: string;
    hearing_type: string;
    schedules: {
        id: number;
        scheduled_date: string;
        schedule_status: string;
        scheduled_by: number;
    }[];
}

interface HearingStore {
    hearings: Hearing[];
    setHearings: (hearings: Hearing[]) => void;
}

export const useHearingStore = create<HearingStore>((set) => ({
    hearings: [],
    setHearings: (hearings) => set({ hearings }),
}));
