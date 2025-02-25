import { Google } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signInWithProvider } from "@/app/(login)/actions";
export default function AuthProviders() {
	return (
		<>
			<div className="flex flex-row gap-2">
				<form action={() => signInWithProvider("google")} className="basis-full">
					<Button type="submit" variant="outline" className="w-full">
						<Google />
					</Button>
				</form>
			</div>
		</>
	);
}
