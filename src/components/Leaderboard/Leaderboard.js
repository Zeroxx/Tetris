import React from 'react';
import './Leaderboard.css';
import { useLeaderboard } from '../../hooks/useLeaderboard';

const Leaderboard = () => {
    const [leaderboard] = useLeaderboard();
    return (
    <div>
        <h1>The top 10 best players</h1>
        <div className="leaderboardWrapper">
            {leaderboard}
        </div>
    </div>
    )
};

export default Leaderboard;