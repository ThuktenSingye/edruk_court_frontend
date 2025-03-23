import { useState, useEffect } from "react";

export function useCases() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCases = async () => {
        const response = await fetch("http://localhost:3002/cases");
        const data = await response.json();
        setCases(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCases();
    }, []);

    return { cases, loading };
}
