"use client";

export const getClientCookie = (name) => {
    if (typeof document !== "undefined") {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const [cookieName, cookieValue] = cookies[i].split("=");
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
    }
    return null;
};
