import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Square({value}){
  return(
  <button className='square'>value</button>
);
}
export default function Board() {
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


