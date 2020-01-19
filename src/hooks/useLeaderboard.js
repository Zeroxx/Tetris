import React, { useState, useEffect } from 'react';
import axios from '../axios-instance';
import Topscorer from '../components/Leaderboard/Topscorer/Topscorer';

export const useLeaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        axios.get('/Leaderboard.json?orderBy="score"&limitToLast=10')
        .then(
            res => {
                const fetchedLeaderboard = [];
                for (let key in res.data) {
                    fetchedLeaderboard.push({
                        ...res.data[key],
                    id: key});
                }
                fetchedLeaderboard.sort((b, a) =>  a.score - b.score);
                setLeaderboardData(fetchedLeaderboard);
            }
        )
        .catch(err => {
            console.log(err);
        })
    },[]);

    let i=0;
    let leaderboard = leaderboardData.map( leaderboard => (
        i++,
        <Topscorer 
        key={leaderboard.id}
        rank={i}
        name={leaderboard.name}
        score={leaderboard.score} />
    ));

    return [leaderboard];
}

