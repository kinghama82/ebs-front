import BasicMenu from "@/components/menus/BasicMenu";
import BootstrapProvider from "@/components/BootstrapProvider";

export default function Layout({ children }) {
    return (

        <div className={"max-w-6xl mx-auto"}> {/* ✅ <body> 대신 <div> 사용 */}
            <BasicMenu />
            {children}
        </div>

    );npm
}
