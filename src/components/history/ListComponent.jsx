import { getHistory } from "@/api/history/historyApi";

const { API_SERVER_HOST } = require("@/api/publicapi");
const { default: useCustomMove } = require("../common/useCustomMove");
const { useState, useEffect } = require("react");

const host = API_SERVER_HOST

const initState = {
    dtoList:[],
    pageNumList:[],
    pageRequestDTO:null,
    prev:false,
    next:false,
    totalCount:0,
    prevPage:0,
    nextPage:0,
    totalPage:0,
    current:0
}

const HistoryList = () =>{
    const {page, size} = useCustomMove()

    const [serverData, setServerData] = useState(initState)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        setFetching(true)

        getHistory({page,size}).then(data => {
            console.log(data)
            setServerData(data)
            setFetching(false)
        })
    },[page,size])

    return(
        <></>
    )
}
export default HistoryList