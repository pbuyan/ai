"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { createClient } from "@supabase/auth-helpers-nextjs";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface UserContextType {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const supabase = createClient();
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const getUser = async () => {
			const { data: sessionData } = await supabase.auth.getSession();
			setSession(sessionData?.session ?? null);
			setUser(sessionData?.session?.user ?? null);
			setIsLoading(false);
		};

		getUser();

		// Listen for auth state changes
		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setSession(null);
		router.push("/login");
	};

	return (
		<UserContext.Provider value={{ user, session, isLoading, signOut }}>{children}</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
