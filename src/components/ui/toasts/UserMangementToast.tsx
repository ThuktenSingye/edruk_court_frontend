// src/components/toasts/UserManagementToasts.tsx
import { toast } from "react-hot-toast";

export const showSuccessToast = (action: 'added' | 'edited' | 'deleted', role: string) => {
    toast.success(
        <div className="flex items-center">
            <span className="mr-2">✓</span>
            <span>
                {role} {action} successfully!
            </span>
            <button
                onClick={() => toast.dismiss()}
                className="ml-4 px-2 py-1 text-xs rounded bg-white text-green-600 hover:bg-green-50"
            >
                Dismiss
            </button>
        </div>,
        {
            duration: 4000,
            position: 'top-right',
        }
    );
};

export const showErrorToast = (action: 'add' | 'edit' | 'delete', role: string, error?: string) => {
    toast.error(
        <div className="flex items-center">
            <span className="mr-2">✕</span>
            <span>
                Failed to {action} {role.toLowerCase()}. {error || 'Please try again.'}
            </span>
            <button
                onClick={() => toast.dismiss()}
                className="ml-4 px-2 py-1 text-xs rounded bg-white text-red-600 hover:bg-red-50"
            >
                Dismiss
            </button>
        </div>,
        {
            duration: 5000,
            position: 'top-right',
        }
    );
};