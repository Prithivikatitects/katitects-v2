"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, CreditCard, LogOut, Palette } from "lucide-react";
import { supabase } from "@/services/supabaseClient";

// Mock user data - replace with actual user data from your auth system
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/user-avatar.png",
  initials: "JD",
  plan: "Pro Plan",
  creditsUsed: 45,
  creditsTotal: 100,
};

export function UserProfilePopover({ sessionData }: { sessionData: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [creditsTotal, setCreditsTotal] = useState<number>(100);
  const [loadingCredits, setLoadingCredits] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const userId = sessionData?.user?.id;
        if (!userId) return;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("credits_remaining")
          .eq("id", userId)
          .single();

        if (error) throw error;

        console.log(profile, "fetched profile data");

        setCreditsRemaining(profile.credits_remaining);
      } catch (err) {
        console.error("Error fetching credits:", err);
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchCredits();
  }, [sessionData?.user?.id]);

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
    // Redirect to login page or clear auth state
  };

  const handleProfileClick = () => {
    // Navigate to profile page
    console.log("Navigate to profile");
  };

  const handleSettingsClick = () => {
    // Navigate to settings page
    console.log("Navigate to settings");
  };

  const handleBillingClick = () => {
    // Navigate to billing page
    console.log("Navigate to billing");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-purple-500/20 transition-all duration-300"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={
                sessionData?.user?.user_metadata?.avatar_url ||
                "/placeholder.svg"
              }
              alt={sessionData?.user?.user_metadata?.full_name}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-sm font-medium">
              {sessionData?.user?.user_metadata?.full_name.split(" ").length >=
              2
                ? sessionData?.user?.user_metadata?.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                : sessionData?.user?.user_metadata?.full_name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 glass-hover border border-border/60 bg-card/90 backdrop-blur-xl shadow-xl"
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="p-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  sessionData?.user?.user_metadata?.avatar_url ||
                  "/placeholder.svg"
                }
                alt={sessionData?.user?.user_metadata?.full_name}
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-medium">
                {sessionData?.user?.user_metadata?.full_name.split(" ")
                  .length >= 2
                  ? sessionData?.user?.user_metadata?.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  : sessionData?.user?.user_metadata?.full_name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {sessionData?.user?.user_metadata?.full_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {sessionData?.user?.user_metadata?.email}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 px-2 py-0.5 text-xs font-medium text-purple-600 dark:text-purple-400">
                  {mockUser.plan}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Credits Usage */}
        {/* Credits Usage */}
        <div className="p-4 border-b border-border/60">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Credits</span>
              {loadingCredits ? (
                <span className="text-xs text-muted-foreground">
                  Loading...
                </span>
              ) : (
                <span className="font-medium">
                  {creditsRemaining ?? 0}/{creditsTotal}
                </span>
              )}
            </div>
            <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                style={{
                  width: `${
                    creditsRemaining !== null
                      ? ((creditsTotal - creditsRemaining) / creditsTotal) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {creditsRemaining !== null
                ? `${creditsRemaining} credits remaining this month`
                : "Fetching credits..."}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-1">
          <DropdownMenuItem
            onClick={handleProfileClick}
            className="glass-hover cursor-pointer rounded-lg px-3 py-2.5 text-sm hover:bg-muted/50 focus:bg-muted/50"
          >
            <User className="mr-3 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleSettingsClick}
            className="glass-hover cursor-pointer rounded-lg px-3 py-2.5 text-sm hover:bg-muted/50 focus:bg-muted/50"
          >
            <Settings className="mr-3 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleBillingClick}
            className="glass-hover cursor-pointer rounded-lg px-3 py-2.5 text-sm hover:bg-muted/50 focus:bg-muted/50"
          >
            <CreditCard className="mr-3 h-4 w-4" />
            <span>Billing & Plans</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="glass-hover cursor-pointer rounded-lg px-3 py-2.5 text-sm hover:bg-muted/50 focus:bg-muted/50">
            <Palette className="mr-3 h-4 w-4" />
            <span>My Designs</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-border/60" />

        {/* Logout */}
        <div className="p-1">
          <DropdownMenuItem
            onClick={handleLogout}
            className="glass-hover cursor-pointer rounded-lg px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 focus:bg-red-50 dark:focus:bg-red-950/20"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
