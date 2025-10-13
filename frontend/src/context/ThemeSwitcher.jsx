import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    themeMode: "light",
    lightTheme: () => { },
    darkTheme: () => { }
})

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem("themeMode") || "light";
    }
    );

    const lightTheme = () => {
        setThemeMode("light")
    }

    const darkTheme = () => {
        setThemeMode("dark")
    }

    useEffect(() => {
        document.querySelector('html').classList.remove("light", "dark")
        document.querySelector('html').classList.add(themeMode);
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode])

    return (
        <ThemeContext.Provider value={{ themeMode, lightTheme, darkTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default function useTheme() {
    return useContext(ThemeContext);
}