"use client";
import { useSession } from "@/lib/auth-client";
import { User } from "better-auth";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const { data } = useSession();

    useEffect(() => {
        setUser(data?.user || null);
    }, [data]);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
