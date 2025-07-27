"use client";
import Ico from "@/app/util-components/ico";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Player = "X" | "O";
type CellValue = Player | null;
type Board = CellValue[];

interface GameState {
    board: Board;
    currentPlayer: Player;
    isGameOver: boolean;
    winner: Player | null;
    winningIndices: number[];
}

interface GameLogic {
    checkWinner: (board: Board) => { winner: Player | null; winningIndices: number[] };
    isDraw: (board: Board) => boolean;
    makeMove: (board: Board, index: number, player: Player) => Board;
}

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const gameLogic: GameLogic = {
    checkWinner: (board) => {
        for (const combination of WINNING_COMBINATIONS) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { winner: board[a] as Player, winningIndices: combination };
            }
        }
        return { winner: null, winningIndices: [] };
    },

    isDraw: (board) => board.every(cell => cell !== null),

    makeMove: (board, index, player) => {
        const newBoard = [...board];
        newBoard[index] = player;
        return newBoard;
    }
};

const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>({
        board: Array(9).fill(null),
        currentPlayer: "X",
        isGameOver: false,
        winner: null,
        winningIndices: []
    });

    const makeMove = (index: number) => {
        if (gameState.board[index] || gameState.isGameOver) return;

        const newBoard = gameLogic.makeMove(gameState.board, index, gameState.currentPlayer);
        const { winner, winningIndices } = gameLogic.checkWinner(newBoard);
        const isDraw = gameLogic.isDraw(newBoard);

        setGameState({
            board: newBoard,
            currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
            isGameOver: winner !== null || isDraw,
            winner,
            winningIndices
        });
    };

    const resetGame = () => {
        setGameState({
            board: Array(9).fill(null),
            currentPlayer: "X",
            isGameOver: false,
            winner: null,
            winningIndices: []
        });
    };

    return { gameState, makeMove, resetGame };
};

const PlayerIcon = ({ player }: { player: Player }) => {
    const iconSrc = player === "X"
        ? "https://cdn-icons-png.flaticon.com/512/18058/18058539.png"
        : "https://cdn-icons-png.flaticon.com/512/686/686700.png";

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1, scale: { type: "spring", bounce: 0.5 } }}
                exit={{ opacity: 0, scale: 0.6 }}
            >
                <Ico src={iconSrc} size={80} className="invert opacity-80" />
            </motion.div>
        </AnimatePresence>
    );
};

const GameCell = ({
    value,
    index,
    isWinning,
    isGameOver,
    onCellClick
}: {
    value: CellValue;
    index: number;
    isWinning: boolean;
    isGameOver: boolean;
    onCellClick: (index: number) => void;
}) => {
    const opacity = !isGameOver ? 1 : (isWinning || (!isGameOver && !value)) ? 1 : 0.3;

    return (
        <div
            style={{ opacity }}
            className="p-15 bg-dune-600 rounded-2xl hover:bg-dune-700 cursor-pointer transition-colors duration-75 relative"
            onClick={() => onCellClick(index)}
        >
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                {value && <PlayerIcon player={value} />}
            </div>
        </div>
    );
};

export default function Page() {
    const { gameState, makeMove, resetGame } = useGameState();

    return (
        <div className="flex flex-col items-center justify-center h-[90vh] text-dune-200">
            <h1 className="text-4xl font-bold uppercase flex items-center gap-3">
                Tic{" "}
                <Ico src="https://cdn-icons-png.flaticon.com/512/686/686700.png" className="invert" />
                {" "}Tac{" "}
                <Ico src="https://cdn-icons-png.flaticon.com/512/2976/2976286.png" className="invert" />
                {" "}Toe{" "}
                <Ico src="https://cdn-icons-png.flaticon.com/512/3461/3461923.png" className="invert" />
            </h1>

            <div className="grid grid-cols-3 bg-dune-900 rounded-2xl gap-1 mt-4 p-1">
                {gameState.board.map((cell, index) => (
                    <GameCell
                        key={index}
                        value={cell}
                        index={index}
                        isWinning={gameState.winningIndices.includes(index)}
                        isGameOver={gameState.isGameOver}
                        onCellClick={makeMove}
                    />
                ))}
            </div>

            <AnimatePresence>
                {gameState.isGameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mt-4">
                            <button
                                className="px-8 py-4 bg-dune-800/30 text-dune-100 tracking-widest uppercase rounded-full text-2xl hover:bg-dune-700 transition-all duration-100 cursor-pointer hover:shadow-lg"
                                onClick={resetGame}
                            >
                                Reset Game
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}