"use client"
import { getTotalRecord } from "@/api/history/historyApi"
import { useEffect, useState } from "react"

const initState = {
    win:0,
    draw:0,
    lose:0
}

export function useHistoryRecord (gamerid){
    const [record, setRecord] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false); 

    useEffect(()=> {
        console.log("useHistoryRecord훅 gamerId 값 : ", gamerid)
        if(!gamerid) {
            console.warn("gamerid가 없어서 api 호출을 하지 않음")
            return
        }

        if (isLoaded) {
            console.log("✅ 이미 정상적인 데이터가 있으므로 API 호출하지 않음");
            return;
        }

        setLoading(true)
        setError(null)

        getTotalRecord(gamerid).then((data)=>{
            console.log("API응답데이터 : ", data)
            if(data && typeof data === "object" && Object.keys(data).length > 0){
                
                setRecord(data);
                setIsLoaded(true)
            }else{
                console.warn("API응답이 잘못되었으므로 기본값 유지")
                setRecord(initState)
            }           
        }).catch((err)=>{
            console.error("통산전적 에러 : ",err)
            setError("데이터 불러오는중 오류 발생")
            setRecord(initState)
        }).finally(()=> setLoading(false))
    },[gamerid])

    return {record, loading, error}
}
