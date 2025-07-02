import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface selectedViewProviderProps 
{
    children : ReactNode;
}

type View =  "ongoing" | "history";

interface selectedViewContext  {
    selectedView : View,
    setSelectedView : React.Dispatch<React.SetStateAction<View>>
}


const ToSelectedViewContext = createContext<selectedViewContext|null>(null);

//This wrap context to be used else where and return value to children components
export function SelectedViewProvider ({children}:selectedViewProviderProps)
{
    const [selectedView, setSelectedView] = useState<"ongoing" | "history">("ongoing");

    return(
        <ToSelectedViewContext.Provider 
        value={{selectedView, setSelectedView}}>
        {children}
        </ToSelectedViewContext.Provider>
    );
}

export const useSelectedView = () => {
    const value = useContext(ToSelectedViewContext);

    if(value == null)
    throw new Error("useTheme has to be used within <toSelectedViewContext>");
    
    return value;
}  