import {getList} from "@/api/rulebook/rulebookapi";

const ListComponent = () => {

    getList().then(data=>{
        console.log(data)

    })

    return(
        <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">

        </div>
    )
}
export default ListComponent;