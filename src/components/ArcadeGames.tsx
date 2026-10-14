import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, RotateCcw, Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Swords } from 'lucide-react';
import { ClanWarsGame } from './ClanWarsGame';

interface ArcadeGamesProps {
  initialGame?: 'clan' | '2048' | 'runner' | 'snake';
}

export const ArcadeGames: React.FC<ArcadeGamesProps> = ({ initialGame = 'clan' }) => {
  const [activeGame, setActiveGame] = useState<'clan' | '2048' | 'runner' | 'snake'>(initialGame);

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 select-none overflow-hidden">
      {/* Top Arcade Navigation */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-xs text-white">Robail Игры & Аркады</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveGame('clan')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeGame === 'clan'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-amber-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Война Кланов (ИИ Омега)</span>
          </button>
          <button
            onClick={() => setActiveGame('2048')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeGame === '2048'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Robail 2048
          </button>
          <button
            onClick={() => setActiveGame('runner')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeGame === 'runner'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Cyber Runner
          </button>
          <button
            onClick={() => setActiveGame('snake')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeGame === 'snake'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Neon Snake
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex items-center justify-center">
        {activeGame === 'clan' && <ClanWarsGame />}
        {activeGame === '2048' && <Game2048 />}
        {activeGame === 'runner' && <CyberRunner />}
        {activeGame === 'snake' && <NeonSnake />}
      </div>
    </div>
  );
};

/* --- 1. ROBAIL 2048 GAME --- */
const Game2048: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(1280);
  const [gameOver, setGameOver] = useState(false);

  const initGame = () => {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    addRandom(newBoard);
    addRandom(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const addRandom = (b: number[][]) => {
    const empty: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      b[r][c] = Math.random() > 0.1 ? 2 : 4;
    }
  };

  const move = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameOver) return;
    let b = board.map((row) => [...row]);
    let points = 0;
    let moved = false;

    const slideRow = (row: number[]) => {
      let filtered = row.filter((val) => val !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          points += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < 4) filtered.push(0);
      return filtered;
    };

    if (direction === 'LEFT') {
      for (let r = 0; r < 4; r++) {
        const newRow = slideRow(b[r]);
        if (newRow.some((val, idx) => val !== b[r][idx])) moved = true;
        b[r] = newRow;
      }
    } else if (direction === 'RIGHT') {
      for (let r = 0; r < 4; r++) {
        const rev = slideRow([...b[r]].reverse()).reverse();
        if (rev.some((val, idx) => val !== b[r][idx])) moved = true;
        b[r] = rev;
      }
    } else if (direction === 'UP') {
      for (let c = 0; c < 4; c++) {
        const col = [b[0][c], b[1][c], b[2][c], b[3][c]];
        const newCol = slideRow(col);
        for (let r = 0; r < 4; r++) {
          if (b[r][c] !== newCol[r]) moved = true;
          b[r][c] = newCol[r];
        }
      }
    } else if (direction === 'DOWN') {
      for (let c = 0; c < 4; c++) {
        const col = [b[0][c], b[1][c], b[2][c], b[3][c]];
        const newCol = slideRow([...col].reverse()).reverse();
        for (let r = 0; r < 4; r++) {
          if (b[r][c] !== newCol[r]) moved = true;
          b[r][c] = newCol[r];
        }
      }
    }

    if (moved) {
      addRandom(b);
      setBoard(b);
      const newScore = score + points;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); move('UP'); }
      if (e.key === 'ArrowDown') { e.preventDefault(); move('DOWN'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); move('LEFT'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move('RIGHT'); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [board, gameOver, score]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-800 text-slate-100';
      case 4: return 'bg-slate-700 text-slate-100';
      case 8: return 'bg-sky-600 text-white font-bold';
      case 16: return 'bg-sky-500 text-white font-bold';
      case 32: return 'bg-indigo-600 text-white font-bold';
      case 64: return 'bg-indigo-500 text-white font-bold';
      case 128: return 'bg-purple-600 text-white font-bold shadow-lg';
      case 256: return 'bg-purple-500 text-white font-bold shadow-lg';
      case 512: return 'bg-amber-600 text-white font-bold shadow-lg';
      case 1024: return 'bg-amber-500 text-white font-bold shadow-xl';
      case 2048: return 'bg-rose-500 text-white font-black shadow-2xl';
      default: return 'bg-slate-900/60 text-transparent';
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h2 className="text-2xl font-black text-purple-400 tracking-wider">2048</h2>
          <span className="text-xs text-slate-400">Join tiles to hit 2048</span>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="block text-[10px] text-slate-400">SCORE</span>
            <span className="font-mono font-bold text-xs text-white">{score}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="block text-[10px] text-slate-400">BEST</span>
            <span className="font-mono font-bold text-xs text-purple-300">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-4 gap-2.5 w-full aspect-square shadow-2xl">
        {board.flat().map((val, i) => (
          <div
            key={i}
            className={`rounded-xl flex items-center justify-center font-mono text-lg transition-all ${getTileColor(
              val
            )}`}
          >
            {val !== 0 && val}
          </div>
        ))}
      </div>

      {/* Controls & Restart */}
      <div className="flex items-center justify-between w-full mt-4">
        <button
          onClick={initGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>

        <div className="grid grid-cols-3 gap-1">
          <div />
          <button onClick={() => move('UP')} className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <div />
          <button onClick={() => move('LEFT')} className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => move('DOWN')} className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => move('RIGHT')} className="p-2 rounded bg-slate-800 text-slate-300 hover:text-white">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- 2. CYBER RUNNER GAME --- */
const CyberRunner: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstaclePos, setObstaclePos] = useState(400);

  const jump = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setScore(0);
      setObstaclePos(400);
      return;
    }
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setObstaclePos((prev) => {
        if (prev <= 30 && prev >= 10 && !isJumping) {
          // Collision!
          setIsPlaying(false);
          return 400;
        }
        if (prev <= 0) {
          setScore((s) => {
            const next = s + 10;
            if (next > highScore) setHighScore(next);
            return next;
          });
          return 400;
        }
        return prev - 8;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [isPlaying, isJumping, highScore]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, isJumping]);

  return (
    <div className="flex flex-col items-center max-w-md w-full">
      <div className="flex items-center justify-between w-full mb-3">
        <h3 className="text-lg font-bold text-sky-400">Cyber Runner</h3>
        <div className="text-xs font-mono text-slate-300">
          Score: <span className="font-bold text-white">{score}</span> | Best: {highScore}
        </div>
      </div>

      <div
        onClick={jump}
        className="w-full h-48 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden cursor-pointer select-none"
      >
        {/* Ground */}
        <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-slate-700" />

        {/* Player */}
        <div
          className={`absolute left-8 bottom-6 w-8 h-8 rounded-lg bg-sky-400 shadow-md shadow-sky-400/50 transition-all ${
            isJumping ? '-translate-y-20' : 'translate-y-0'
          }`}
        />

        {/* Obstacle */}
        <div
          style={{ left: `${obstaclePos}px` }}
          className="absolute bottom-6 w-5 h-8 rounded bg-rose-500 shadow-md shadow-rose-500/50"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center">
            <p className="text-sm font-bold text-white mb-2">Click or Press Space to Jump</p>
            <button className="px-4 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-medium">
              Start Runner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- 3. NEON SNAKE GAME --- */
const NeonSnake: React.FC = () => {
  const [snake, setSnake] = useState<[number, number][]>([[10, 10]]);
  const [food, setFood] = useState<[number, number]>([5, 5]);
  const [dir, setDir] = useState<[number, number]>([0, 1]);
  const [isDead, setIsDead] = useState(false);
  const [score, setScore] = useState(0);

  const reset = () => {
    setSnake([[10, 10]]);
    setFood([5, 5]);
    setDir([0, 1]);
    setIsDead(false);
    setScore(0);
  };

  useEffect(() => {
    if (isDead) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = [prev[0][0] + dir[0], prev[0][1] + dir[1]] as [number, number];
        if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) {
          setIsDead(true);
          return prev;
        }
        if (prev.some((p) => p[0] === head[0] && p[1] === head[1])) {
          setIsDead(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((s) => s + 1);
          setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 110);
    return () => clearInterval(interval);
  }, [dir, food, isDead]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dir[0] !== 1) setDir([-1, 0]);
      if (e.key === 'ArrowDown' && dir[0] !== -1) setDir([1, 0]);
      if (e.key === 'ArrowLeft' && dir[1] !== 1) setDir([0, -1]);
      if (e.key === 'ArrowRight' && dir[1] !== -1) setDir([0, 1]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  return (
    <div className="flex flex-col items-center max-w-sm w-full">
      <div className="flex items-center justify-between w-full mb-3">
        <h3 className="text-lg font-bold text-emerald-400">Neon Snake</h3>
        <span className="text-xs font-mono text-slate-300">Score: {score}</span>
      </div>

      <div className="w-72 h-72 bg-slate-900 border border-slate-800 rounded-2xl relative grid grid-cols-20 grid-rows-20 p-1">
        {snake.map(([r, c], idx) => (
          <div
            key={idx}
            style={{ gridRowStart: r + 1, gridColumnStart: c + 1 }}
            className={`rounded-xs ${idx === 0 ? 'bg-emerald-400' : 'bg-emerald-600'}`}
          />
        ))}
        <div
          style={{ gridRowStart: food[0] + 1, gridColumnStart: food[1] + 1 }}
          className="rounded-full bg-rose-500 animate-pulse"
        />

        {isDead && (
          <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center">
            <p className="text-rose-400 font-bold mb-2">Game Over!</p>
            <button onClick={reset} className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
