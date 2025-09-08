import { Mic } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export function VoiceSupportButton(props: React.ComponentProps<typeof Button>) {
  const { toast } = useToast();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: "Voice Support",
      description: "This feature is coming soon!",
    });
    props.onClick?.(e);
  };
  
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
      {...props}
      onClick={handleClick}
    >
      <Mic className="h-4 w-4" />
      <span className="sr-only">Use voice</span>
    </Button>
  );
}
