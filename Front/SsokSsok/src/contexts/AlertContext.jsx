import { Children, createContext, useCallback, useContext, useState } from "react";
import React from "react";
import CustomAlert from "../components/CustomAlert";

const AlertContext = createContext()

export const AlertProvider = ({ children }) => {
    const [message, setMessage] = useState(null)
    const showAlert = useCallback((msg) => {
        setMessage(msg)
    }, [])

    const hideAlert = () => {
        setMessage(null)
    }

    return (
        <AlertContext.Provider value={{showAlert}}>
            {children}
            {message && <CustomAlert message={message} onClose={hideAlert}/>}
        </AlertContext.Provider>
    )
}

export const useAlert = () => {
    return useContext(AlertContext)
}