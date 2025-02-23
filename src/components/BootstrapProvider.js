"use client"; // 클라이언트 컴포넌트로 지정

import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BootstrapProvider({ children }) {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return <>{children}</>;
}
