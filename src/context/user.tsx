"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
// import { createClient } from "@supabase/auth-helpers-nextjs";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { getAuthUser } from "@/utils/supabase/actions";
import type { AuthUser } from "@/lib/types";

interface UserContextType {
	user: AuthUser | null;
	session: Session | null;
	isLoading: boolean;
	signOut: () => void;
	fetchAuthUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const supabase = createClient();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	const fetchAuthUser = useCallback(async () => {
		try {
			const authUser = await getAuthUser();
			setUser(authUser ?? null);
		} catch (error) {
			console.error("Error fetching user from database:", error);
			return null;
		}
	}, [pathname]);

	useEffect(() => {
		fetchAuthUser();
	}, [pathname]);

	useEffect(() => {
		const getUser = async () => {
			const { data: sessionData } = await supabase.auth.getSession();
			setSession(sessionData?.session ?? null);
			setIsLoading(false);
		};

		getUser();

		// Listen for auth state changes
		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
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
		<UserContext.Provider value={{ user, session, isLoading, signOut, fetchAuthUser }}>
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
