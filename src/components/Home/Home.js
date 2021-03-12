import React, { useState, useEffect, useRef } from 'react'
import cardsarray from '../../utils/boards.json'
import './Home.scss'
import { map, shuffle, set, get, size, some } from 'lodash'
import { formatTime } from '../../utils/formatTime';

const Home = () => {
  const[cards, setCards] = useState(shuffle(cardsarray['CARDS']))
  const[board, setBoard] = useState([])
  const[disableClikc, setDisableClick] = useState(false)
  const[end, setEnd] = useState(false)
  const[timer, setTimer] = useState(0)
  const[wins, setWins] = useState(0)
  const[isPaused, setIsPaused] = useState(false)
  const countRef = useRef(null)

  useEffect(() => {
    const match = get(board, '[0].symbolName', '') === get(board, '[1].symbolName', null)
    if(match) {
      map(cards, (values, index) => {
        if(values.name === get(board, [0], '')){
          set(cards, `[${index}].clicked`, true)
        } 
      })
      setBoard([])
    }
    if(size(board) === 2 && !match) {
      setDisableClick(true)
      setTimeout(function(){
        const index = [get(board, '[0].index'), get(board, '[1].index')]
        map(index, (values) => {
          set(cards, `[${values}].clicked`, false)
        })
        setBoard([])
        setDisableClick(false)
      }, 1000)
    }
    verifyEnd()
  }, [board])

  useEffect(() => {
    handleTimer()
  }, [])

  const flipCard = async(e, symbolName) => {
    const index = e.target.id
    set(cards, `[${index}].clicked`, true)
    setBoard([...board, {symbolName, index}])
  }

  const verifyEnd = () => {
    const end = some(cards, ['clicked', false])
    if(!end){
      setEnd(true)
      setWins(+1)
      handlePause()
    }
  }

  const handleTimer = () => {
    if(!isPaused){
      countRef.current = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const restart = () => {
    setCards(shuffle(cardsarray["CARDS"]))
    setTimer(0)
    setBoard([])
    map(cards, (values, index) => {
      set(cards, `[${index}].clicked`, false)
    })
    setEnd(false)
  }

  return(
    <div className="home-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <h2>Jogo da Memoria</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
          <span>Tempo - {formatTime(timer)}</span>
          </div>
          <div className="col-4">
            <span>Placar: {wins}</span>
          </div>
          <div className="col-4">
            <button type="button" className="btn btn-primary restart" onClick={() => restart()}>Recomeçar</button>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12">
            {!end ? 
            <ul className="board-container">
              {map(cards, (value, index) => (
                <li className={disableClikc ? "disabled card" : "card"} id={index} key={index} onClick={(e) => flipCard(e, get(value, 'name', ''))}>
                    <ion-icon class={get(value, 'clicked', true) ? "visible" : "hidden"} name={get(value, 'name', '')} id={index}></ion-icon>
                </li>
              ))}
            </ul> 
            : 
            <div className="center">
              <h2>Parabens Você Ganhou!</h2>
            </div>
            }
          </div>
        </div>    
      </div>
    </div>
  )
}

export default Home