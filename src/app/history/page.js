import { TabsDemo } from "@/components/history/TabsComponent";
import BasicMenu from "@/components/menus/BasicMenu";
import Link from "next/link";

const HistoryPage = () => {



    return ( <>
        <BasicMenu/>
        
            <div className="flex flex-row gap-12 rounded-md mt-2 max-w-6xl mx-auto border-1 bg-gray-300 min-h-96">
                {/* 왼쪽공간 */}
                <div className="m-1 basis-6/12 card border-black">
                              여기는 차트 공간              
                </div>
                
               {/* 오른쪽공간 */}
                <div className="m-1 basis-6/12 card border-black">
                    <div className="m-1 flex" >
                    <Link href="/history/new" 
                          className="p-1 text-md rounded text-center ml-auto text-black w-auto no-underline bg-gray-300">
                        기록 작성
                    </Link>
                    </div>
                    <TabsDemo></TabsDemo>
                </div>              
            </div>
            {/* 아래공간 */}
            <div className="mt-4 max-w-6xl mx-auto bg-gray-300 rounded min-h-96 my-auto">
                아래공간
            </div>
          
        
        
        
    </>);
    }
    export default HistoryPage;

 