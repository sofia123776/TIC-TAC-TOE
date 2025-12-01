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
  const [square, setSquare] = useState(Array(9).fill(null));
  return (
    <>
  <div className='board-row'>
  <Square/>
  <Square/>
  <Square/>
  </div>

  <div className='board-row'>
  <Square/>
  <Square/>
  <Square/>
  </div>
  <div className='board-row'>
  <Square/>
  <Square/>
  <Square/>
  </div>
  
  </>
  )
}


