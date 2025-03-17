import EditorComponent from "@/components/common/EditorComponent";
import BasicMenu from "@/components/menus/BasicMenu";
import React from "react";

const Newpage = () => {

    return (
        <div>
            <BasicMenu></BasicMenu>
            <div>
                <EditorComponent></EditorComponent>
            </div>
        </div>
    );
}
export default Newpage;