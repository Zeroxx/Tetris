import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = (rowsCleared, comboCheck) => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);
    const [multiplier, setMultiplier] = useState(1);

    const linePoints = [40, 100, 300, 1200];

    const calcScore = useCallback(() => {
        if (rowsCleared > 0) {
            setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1) * multiplier);
            setRows(prev => prev += rowsCleared);
        }
    },[level, linePoints, rowsCleared, multiplier]);

// ----------------- Custom additions by JD -------------------- //

    const calcMultiplier = useCallback(() => {
        if (rowsCleared > 0 && comboCheck) {
                setMultiplier(prev => prev + 1);
        }
    },[rowsCleared, comboCheck]);
    
    const resetMultiplier = useCallback(() => {
        if (!comboCheck) {
            setMultiplier(1);
        }
    },[comboCheck]);

    useEffect(() => {
        calcScore();
        calcMultiplier();
        resetMultiplier();
    }, [calcScore, rowsCleared, score, calcMultiplier, resetMultiplier])

    // ------------------------------------------------------- //
    
    return[score, setScore, rows, setRows, level, setLevel, multiplier, setMultiplier];
}
