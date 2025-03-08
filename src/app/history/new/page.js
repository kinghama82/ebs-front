"use client"
import { useCustomCookie } from "@/components/common/useCustomCookie";
import HistoryAddComponent from "@/components/history/HistoryAddComponent";
import BasicMenu from "@/components/menus/BasicMenu";

const NewHistoryPage = () => {

    const userInfo = useCustomCookie()
    

    return(
        <div>
            <BasicMenu/>
            <HistoryAddComponent/>
            
        </div>
    )
}
export default NewHistoryPage;