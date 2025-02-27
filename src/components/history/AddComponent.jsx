const { useState } = require("react")

const initState = {
    title:'',
    content:'',
    win:0,
    draw:0,
    lose:0,
    files:[],
    mate:[],
    game:'',
    gamer:'',
    date:''
}

const AddComponent = () =>{
    const [history, setHistory] = useState({...initState})
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState(null)

    
}