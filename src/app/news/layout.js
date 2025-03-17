import BasicMenu from "@/components/menus/BasicMenu";
import BootstrapProvider from "@/components/BootstrapProvider";

export default function Layout({ children }) {
    return (

        <div> {/* ✅ <body> 대신 <div> 사용 */}
            <BasicMenu />
            {children}
        </div>

    );
}
