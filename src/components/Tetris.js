import React, { useState } from 'react';
import { createStage, checkCollision } from '../gameHelpers';
import axios from '../axios-instance';

// Styled components
import {StyledTetris, StyledTetrisWrapper} from './styles/StyledTetris';

// Custom Hooks
import {useInterval} from '../hooks/useInterval';
import {usePlayer} from '../hooks/usePlayer';
import {useStage} from '../hooks/useStage';
import {useGameStatus} from '../hooks/useGameStatus';
import {backgroundEffect} from '../backgroundEffect';
import {useMusic} from '../hooks/useMusic';

// Components
import Stage from './Stage';
import Button from './Button';
import Display from './Display';
import Leaderboard from './Leaderboard/Leaderboard';


const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [leaderboardStatus, setLeaderboardStatus] = useState(false);
    const [name, setName] = useState('');
    const [scoreSubmitted, setScoreSubmitted] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared, comboCheck] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel, multiplier, setMultiplier] = useGameStatus(rowsCleared, comboCheck);
    const [playSong] = useMusic();

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0})) {
            updatePlayerPos({x: dir, y: 0});
        }  
    }

    const startGame = () => {
        //Reset everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setLevel(0);
        setRows(0);
        setMultiplier(1);
        playSong(true);
        setScoreSubmitted(false);  
    }

    const drop = () => {
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            setDropTime(900 /(level + 1) + 100);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1})) {
            updatePlayerPos({ x:0, y: 1, collided: false})
        }
        else {
            //Game Over
            if(player.pos.y < 1) {
                console.log("Game over!");
                setGameOver(true);
                playSong(false);
                setDropTime(null);
            }
            updatePlayerPos({x: 0, y:0, collided: true});
        }
    }
    const keyUp = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 40) {
                setDropTime(900 /(level + 1) + 100);
            }
        }
    }
    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }

    const move = ({keyCode}) => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40){
                dropPlayer();
            } else if (keyCode === 88){
                playerRotate(stage, 1);
            } else if (keyCode === 90){
                playerRotate(stage, -1);
            } 
        }
    }

    const showLeaderboard = () => {
        if (!leaderboardStatus){
            setLeaderboardStatus(true);
        }
        else {
            setLeaderboardStatus(false);
        }
    };

    const submitScore = () => {
        const data = {
            score: score,
            name: name
        };
        axios.post('/Leaderboard.json', data)
            .then(res => {
                console.log(res);
                setScoreSubmitted(true);
                setLeaderboardStatus(true);
            });
    }

    const handleChange = (e) => {
        setName(e.target.value);
    }

    useInterval (() => {
        drop();
    }, dropTime)
    
    backgroundEffect();

    let submitToLeaderboard = "";
    if (!scoreSubmitted){
       submitToLeaderboard = <div><input type="text" value={name} onChange={handleChange} placeholder="Name"></input>
                             <Button callback={submitScore} text="Submit score"/></div>
    }

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e=> move(e)} onKeyUp={keyUp}>
            <StyledTetris>
                {leaderboardStatus ? (
                    <Leaderboard/>
                ) : (<Stage stage={stage}/>)}
                <aside>
                    {gameOver ? (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                            <Display text={`Multiplier: x${multiplier}`} />
                            <Display gameOver={gameOver} text="Game Over" />
                            {submitToLeaderboard}
                        </div>
                    ) : (
                    <div>
                        <Display text={`Score: ${score}`} />
                        <Display text={`Rows: ${rows}`} />
                        <Display text={`Level: ${level}`} />
                        <Display text={`Multiplier: x${multiplier}`} />                        
                    </div>
                    )}
                   {leaderboardStatus ? (                      
                        <Button callback={showLeaderboard} text={'Hide Leaderboard'}/>
                        ) : (
                        <div>
                            <Button callback={showLeaderboard} text={'Show Leaderboard'}/>
                            <Button callback={startGame} text={'Start Game'}/> 
                       </div>  
                        )}
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    )
}

export default Tetris;