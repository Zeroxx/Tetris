import React from 'react';
import Tetris from './components/Tetris';
import './App.css';
import './custom.css';

const App = () => {

  return (
    <div className="App">
      <div id="bg">
        <canvas id="js-canvas"></canvas>
      </div>
      <Tetris/>
    </div>
  );
}

export default App;
