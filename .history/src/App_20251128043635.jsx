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
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
  <div className='board-row'>
  <Square value = {squares[1]} onSquareClick={Handleclick}/>
  <Square value = {squares[2]} onSquareClick={Handleclick}/>
  <Square value = {squares[3]} onSquareClick={Handleclick}/>
  
  </div>

  <div className='board-row'>
  <Square value = {squares[4]} onSquareClick={Handleclick}/>
  <Square value = {squares[5]} onSquareClick={Handleclick}/>
  <Square value = {squares[6]} onSquareClick={Handleclick}/>
  
  </div>
  <div className='board-row'>
  <Square value = {squares[7]} onSquareClick={Handleclick}/>
  <Square value = {squares[8]} onSquareClick={Handleclick}/>
  <Square value = {squares[9]} onSquareClick={Handleclick}/>
  
  </div>
  
  </>
  )
}


