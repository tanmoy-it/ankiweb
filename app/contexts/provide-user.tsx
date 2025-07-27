"use client"

import { UserProvider } from "./userContext"



export default function ProvideUser({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    )
}