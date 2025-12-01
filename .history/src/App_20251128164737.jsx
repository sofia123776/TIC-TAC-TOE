import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Square({value, onSquareClick}){
  
  
  return(
  <button className='square' onClick={onSquareClick}>{value}</button>
);
}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function Handleclick(i){
    const nextSquares = squares.slice()
    if (xIsNext){
    nextSquares[i] = "X"
    }else{
      nextSquares[i] = "O"
    }
    setSquares(nextSquares);
    setXIsNext(xIsNext);
  }
  return (
    <>
  <div className='board-row'>
  <Square value = {squares[0]} onSquareClick={() =>Handleclick(0)}/>
  <Square value = {squares[1]} onSquareClick={() =>Handleclick(1)}/>
  <Square value = {squares[2]} onSquareClick={() =>Handleclick(2)}/>
  
  </div>

  <div className='board-row'>
  <Square value = {squares[3]} onSquareClick={() =>Handleclick(3)}/>
  <Square value = {squares[4]} onSquareClick={() =>Handleclick(4)}/>
  <Square value = {squares[5]} onSquareClick={() =>Handleclick(5)}/>
  
  </div>
  <div className='board-row'>
  <Square value = {squares[6]} onSquareClick={() =>Handleclick(6)}/>
  <Square value = {squares[7]} onSquareClick={() =>Handleclick(7)}/>
  <Square value = {squares[8]} onSquareClick={() =>Handleclick(8)}/>
  
  </div>
  
  </>
  )
}