"use client";
import { useState, useEffect } from "react";

const useFetch = <T,>(url: string, initialState: T) => {
    const [data, setData] = useState<T>(initialState);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async (options?: RequestInit) => {
        setLoading(true);
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
            setError(null);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to fetch data";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    return { data, error, loading, setData, fetchData };
};

export default useFetch;