"use client";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  SignInDialog,
  useSignInDialog,
} from "@/components/layout/sign-in-dialog";

export default function TopNav() {
  const setShowSignInDialog = useSignInDialog((s) => s.setOpen);
  const scrolled = useScroll(50);
  return (
    <>
      <SignInDialog />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logo.webp"
              alt="Logo image of a chat bubble"
              width="191"
              height="191"
              className="mr-2 size-[30px] rounded-sm"
            />
            <p>AI Gen</p>
          </Link>
          <Link href={"/dashboard"}>Dashboard</Link>
          <div>
            <Button
              size="sm"
              className="rounded-full border border-primary transition-all hover:bg-primary-foreground hover:text-primary"
              onClick={() => setShowSignInDialog(true)}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
