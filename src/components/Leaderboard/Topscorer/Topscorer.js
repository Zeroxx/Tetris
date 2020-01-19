import React from 'react';

const Topscorer = ({name, score, rank}) => (
    <div className="scoreWrapper">
        <div className="leaderboardRank">{rank}</div>
        <div className="leaderboardName">{name}</div>
        <div className="leaderboardScore">{score}</div>
    </div>
);

export default Topscorer;