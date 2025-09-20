import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search } from "lucide-react";

export function Navigation() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white shadow-md",
        "h-16 flex items-center px-4"
      )}
      style={{
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08), 0 1.5px 0 0 rgba(0,0,0,0.03)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center mr-6">
        <span className="text-2xl font-bold text-blue-600 select-none">f</span>
      </div>

      {/* Expanding Search Bar */}
      <div className="relative flex-1 max-w-xs">
        <div
          className={cn(
            "flex items-center transition-all duration-300 bg-gray-100 rounded-full px-3",
            searchOpen ? "w-full shadow" : "w-40"
          )}
          onClick={() => setSearchOpen(true)}
          tabIndex={0}
          onBlur={() => setSearchOpen(false)}
        >
          <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search here..."
            className={cn(
              "bg-transparent border-0 focus:ring-0 transition-all duration-300 focus-visible:ring-0"
            )}
            onBlur={() => setSearchOpen(false)}
            onFocus={() => setSearchOpen(true)}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Avatar with Context Menu */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default Navigation;
