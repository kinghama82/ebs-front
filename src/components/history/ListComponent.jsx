"use client"
import { getList } from "@/api/history/historyApi";
import { API_SERVER_HOST } from "@/api/publicapi";
import useCustomMove from "../common/useCustomMove";
import { useEffect, useState } from "react";
import FetchingModal from "../common/FetchingModal";
import PageComponent from "../common/PageComponent";



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
    const {page, size, moveToList} = useCustomMove()

    const [serverData, setServerData] = useState(initState)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        setFetching(true)

        getList({page,size}).then(data => {
            console.log(data)
            setServerData(data)
            setFetching(false)
        })
    },[page,size])

    return(
        <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
            {fetching ? <FetchingModal></FetchingModal> : <></>}

            <div className="flex flex-wrap mx-auto p-6">
                {serverData.dtoList.map(history => 
                    <div key={history.id}
                        className="w-1/2 p-1 rounded shadow-md border-2" onClick={() => moveToRead(history.id)}>
                        <div className="flex flex-col h-full">
                            <div className="font-extrabold text-2xl p-2 w-full">{history.id}</div>
                            <div className="text-xl m-1 p-2 w-full flex flex-col">
                                <div className="w-full overflow-hidden">
                                    
                                    {/* <img alt="product" className="m-auto rounded-md w-60"
                                        src={`${host}/api/products/view/s_${product.uploadFileNames[0]}`}>
                                    </img> */}
                                    
                                </div>
                            <div className="bottom-0 font-extrabold bg-white">
                                <div className="text-center p-1">제목:{history.title}</div>
                            </div>
                            </div>
                        </div>                        
                    </div>
                )}

            </div>
            <PageComponent serverDate={serverData} movePage={moveToList}></PageComponent>
        </div>
    )
}
export default HistoryList