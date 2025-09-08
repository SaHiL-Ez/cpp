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


export function Header() {
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
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2 flex-1">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="size-5" />
        </div>
        <h1 className="text-lg font-semibold">AgriMitra</h1>
      </div>

      <div className="flex-1 flex justify-center items-center gap-2">
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

      <div className="relative flex-1 flex justify-end items-center gap-2">
         <Dialog>
          <DialogTrigger asChild>
             <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <MessageSquareHeart className="h-5 w-5" />
              <span className="sr-only">Give Feedback</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleFeedbackSubmit}>
              <DialogHeader>
                <DialogTitle>Share Your Feedback</DialogTitle>
                <DialogDescription>
                  We'd love to hear your thoughts on how we can improve
                  AgriMitra.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid w-full gap-2">
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you think..."
                    rows={5}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit Feedback</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
