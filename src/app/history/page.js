

import HistoryChart from "@/components/history/HistoryChart";
import HistoryList from "@/components/history/HistoryList";
import { HistoryTab } from "@/components/history/HistoryTab";
import BasicMenu from "@/components/menus/BasicMenu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

const HistoryPage = () => {
    return ( <>
        <BasicMenu/>
        
            <div className="flex flex-row gap-12 rounded-md mt-2 max-w-6xl mx-auto border-1 bg-gray-300 min-h-96">
                {/* 왼쪽공간 */}
                <div className="m-1 basis-6/12 card border-black">
                    <div className="m-1">
                        <Button>닉네임출력부분</Button>
                    </div>
                    <div>
                        <HistoryChart/>
                    </div>                                           
                </div>
                
               {/* 오른쪽공간 */}
                <div className="m-1 p-1 basis-6/12 card border-black">                  
                    <HistoryTab/>
                </div>              
            </div>
            {/* 사이공간 */}
            <div className="m-2 max-w-6xl mx-auto flex justify-end relative">
                <Button variant="secondary" className="text-white text-md">
                    <Link href={`/history/new`}>기록 작성</Link>
                </Button>
            </div>
            {/* 아래공간 */}
            <div className=" max-w-6xl mx-auto bg-gray-300 rounded -mt-7">
                <Suspense fallback={<div>Loading...</div>}>
                    <HistoryList/>
                </Suspense>
            </div>
          
        
        
        
    </>);
    }
    export default HistoryPage;

 