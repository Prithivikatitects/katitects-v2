"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "@/public/images/logo.png";
import Image from "next/image";
import { UserProfilePopover } from "./user-profile";
import { supabase } from "@/services/supabaseClient";
import { GradientButton } from "./ui/GradientButton";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession();
      setSession(session.data.session);
      setIsAuthenticated(!!session.data.session);
    };
    fetchSession();
  }, []);

  const navigateToSignIn = useCallback(() => {
    router.push("/auth");
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        {" "}
        <div className="flex items-center space-x-3">
          <Image
            src={Logo}
            height={100}
            width={100}
            alt="logo"
            className="h-7 w-7 cursor-pointer hover:scale-105 transition-all duration-200"
          />
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Katitects
            </span>
            <div className="text-xs text-muted-foreground">
              AI-Powered Design
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <UserProfilePopover sessionData={session} />
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <GradientButton
                className="h-8 px-4 flex justify-center items-center text-[12px]"
                onClick={navigateToSignIn}
              >
                Sign In
              </GradientButton>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
