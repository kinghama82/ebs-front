"use client"

import { useEffect, useState } from "react"
import FetchingModal from "../common/FetchingModal"
import BasicMenu from "../menus/BasicMenu"
import { addHistory } from "@/api/history/historyApi"
import styled from "styled-components"

const initState = {
    title:'',
    content:'',
    win:0,
    draw:0,
    lose:0,
    mate:[],
    game:'',
    gamer:'',
    date:''
}

const AddComponent = () =>{
    const [history, setHistory] = useState({...initState})
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    const handleChangeHistory = (e) => {
        history[e.target.name] = e.target.value
        setHistory({...history})
    }

    useEffect(() =>{
        console.log("Updated history state:", history)
    },[history])

    const handleChangeResult = (e) =>{
        const {id} = e.target
        console.log("Clicked ID:", id)
        setHistory((prevState) => {
            const newState = {
                ...prevState,
                win: id === "radio1" ? 1: 0,
                draw: id === "radio2" ? 1: 0,
                lose: id === "radio3" ? 1: 0,
            }
            console.log("Updated History:",newState)
            return newState
        })       
    }

    const handleClickAdd = (e) => {
        const formData = new FormData()

        formData.append("title", history.title)
        formData.append("content", history.content)
        formData.append("game", history.game)
        formData.append("gamer", history.gamer)
        formData.append("win", history.win)
        formData.append("draw", history.draw)
        formData.append("lose", history.lose)

        console.log(formData)
        setFetching(true)

        addHistory(formData).then(data => {
            setFetching(false)
            setResult(data.result)
        })
    }
    const closeModal = () => {
        setResult(null)        
    }
    return(
        <>
        <BasicMenu/>
        <div className="border-2 max-w-6xl mx-auto rounded mt-10 m-2 p-4">
            {fetching ? <FetchingModal></FetchingModal> : <></>}
        <div className="m-2 flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">제목</div>
            <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                   name="title"
                   type={'text'}
                   value={history.title}
                   onChange={handleChangeHistory}>
            </input>
            </div>
        </div>
        <div className="m-2 flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">내용</div>
            <textarea className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                   name="content"
                   rows="4"
                   value={history.content}
                   onChange={handleChangeHistory}>
            </textarea>
            </div>
        </div>
        <div className="m-2 flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">게임</div>
            <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                   name="game"
                   type={'text'}
                   value={history.game}
                   onChange={handleChangeHistory}>
            </input>
            </div>
        </div>
        <div className="m-2 flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">작성자</div>
            <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                   name="gamer"
                   type={'text'}
                   value={history.gamer}
                   onChange={handleChangeHistory}>
            </input>
            </div>
        </div>
        <div>
        <StyledWrapper>
        <div className="radio-buttons-container">
            <div className="radio-button">
                <input name="radio-group" id="radio1" className="radio-button__input" type="radio" 
                       checked={history.win === 1} onChange={handleChangeResult}/>
                <label htmlFor="radio1" className="radio-button__label">
                <span className="radio-button__custom" />
                    승(Win)
                </label>
            </div>
            <div className="radio-button">
                <input name="radio-group" id="radio2" className="radio-button__input" type="radio" 
                       checked={history.draw === 1} onChange={handleChangeResult}/>
                <label htmlFor="radio2" className="radio-button__label">
                <span className="radio-button__custom" />
                    무(Draw)
                </label>
            </div>
            <div className="radio-button">
                <input name="radio-group" id="radio3" className="radio-button__input" type="radio" 
                       checked={history.lose === 1} onChange={handleChangeResult}/>
                <label htmlFor="radio3" className="radio-button__label">
                <span className="radio-button__custom" />
                    패(Lose)
                </label>
            </div>
        </div>
        </StyledWrapper>
        </div>
        <div className="flex justify-end">
            <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
                <button type="button" className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
                            onClick={handleClickAdd}>ADD
                </button>
            </div>
        </div>
        </div>
        </>
    )
}
export default AddComponent;


const StyledWrapper = styled.div`
  .radio-buttons-container {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .radio-button {
    display: inline-block;
    position: relative;
    cursor: pointer;
  }

  .radio-button__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .radio-button__label {
    display: inline-block;
    padding-left: 30px;
    margin-bottom: 10px;
    position: relative;
    font-size: 16px;
    color: #000;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .radio-button__custom {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #555;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .radio-button__input:checked + .radio-button__label .radio-button__custom {
    transform: translateY(-50%) scale(0.9);
    border: 5px solid #4c8bf5;
    color: #4c8bf5;
  }

  .radio-button__input:checked + .radio-button__label {
    color: #4c8bf5;
  }

  .radio-button__label:hover .radio-button__custom {
    transform: translateY(-50%) scale(1.2);
    border-color: #4c8bf5;
    box-shadow: 0 0 10px #4c8bf580;
  }`;