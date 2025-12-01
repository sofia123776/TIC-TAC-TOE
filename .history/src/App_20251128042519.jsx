import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Square(){
  const[value, setValue] = useState(null);
  function Handleclick(){
    setValue('X');
  }
  return(
  <button className='square' onClick={Handleclick}>{value}</button>
);
}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
  <div className='board-row'>
  <Square value = {squares[1]}/>
  <Square value = {squares[2]}/>
  <Square value = {squares[3]}/>
  </div>

  <div className='board-row'>
  <Square value = {squares[4]}/>
  <Square value = {squares[5]}/>
  <Square value = {squares[6]}/>
  </div>
  <div className='board-row'>
  <Square value = {squares[7]}/>
  <Square value = {squares[8]}/>
  <Square value = {squares[9]}/>
  </div>
  
  </>
  )
}


