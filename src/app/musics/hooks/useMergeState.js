'use client';
import { useState, useCallback } from "react";

export function useMergeState(initialState) {
    const [state, setState] = useState(initialState);
    const mergeState = useCallback(
        (newState) =>
            setState((prev) => ({
                ...prev,
                ...newState,
            })),
        []
    );
    return [state, mergeState];
}
