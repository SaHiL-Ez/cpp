"use client";

import { Leaf, User, MessageSquareHeart, ChevronDown, PlusCircle } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useFarm } from "@/contexts/farm-context";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const { toast } = useToast();
  const { farms, selectedFarm, setSelectedFarmById } = useFarm();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your valuable feedback!",
    });
    // In a real app, you would handle form submission state and close the dialog
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14">
      {/* Absolute AgriMitra at top-left */}
      <div className="absolute left-4 top-2 z-50">
        <Link href={`/${locale}/dashboard`} className="font-bold text-lg">
          AgriMitra
        </Link>
      </div>
      {/* Main header content */}
      <div className="container flex h-14 items-center justify-center mx-auto relative">
        {/* Centered farm switching/addition */}
        <div className="flex items-center space-x-4">
          {/* Farm Switcher */}
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-64 justify-center gap-2 group">
                <selectedFarm.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="truncate font-medium">{selectedFarm.name}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", menuOpen && "rotate-180")} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="center">
              <DropdownMenuLabel>Select a Farm</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedFarm.id} onValueChange={setSelectedFarmById}>
                {farms.map((farm) => (
                  <DropdownMenuRadioItem key={farm.id} value={farm.id} className="gap-2">
                     <farm.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{farm.name}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
              <DialogTrigger asChild>
                  <Button size="icon" className="relative overflow-visible shadow-lg animate-pulse-glow rounded-md">
                      <PlusCircle className="h-6 w-6" />
                      <span className="sr-only">Add New Farm</span>
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                      <DialogTitle>Add a New Farm</DialogTitle>
                      <DialogDescription>
                          This feature is coming soon! Enter the details for your new farm here.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                      <p className="text-sm text-muted-foreground text-center">Form fields for adding a new farm will go here.</p>
                  </div>
                  <DialogFooter>
                      <Button type="button" disabled>Save Farm</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}