'use client'

import { createContext, useState } from 'react';


export const AplicacionContext = createContext({});

export default function AppProvider({ children }: any) {
    const [socket, setSocket] = useState(null)

    return <AplicacionContext.Provider value="">{children}</AplicacionContext.Provider>;
}