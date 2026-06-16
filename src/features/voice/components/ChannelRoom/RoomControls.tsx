import { Mic, MicOff, Headphones, PhoneOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoomControlsProps {
  isMuted: boolean;
  isDeafened: boolean;
  isOwner: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onLeave: () => void;
  onEnd?: () => void;
}

export function RoomControls({
  isMuted,
  isDeafened,
  isOwner,
  onToggleMute,
  onToggleDeafen,
  onLeave,
  onEnd,
}: RoomControlsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-4 bg-neutral-900/95 dark:bg-neutral-950/95 backdrop-blur-md px-6 py-3 border border-neutral-800 rounded-full max-w-max mx-auto shadow-2xl sticky bottom-4 z-20">
        
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                onClick={onToggleMute}
                variant={isMuted ? "destructive" : "ghost"}
                className={`h-11 w-11 rounded-full cursor-pointer transition-all ${
                  isMuted
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              />
            }
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </TooltipTrigger>
          <TooltipContent className="bg-neutral-950 text-white text-xs border-neutral-800">
            <p>{isMuted ? "Unmute Microphone" : "Mute Microphone"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                onClick={onToggleDeafen}
                variant={isDeafened ? "destructive" : "ghost"}
                className={`h-11 w-11 rounded-full cursor-pointer transition-all ${
                  isDeafened
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              />
            }
          >
            <Headphones className="h-5 w-5" />
          </TooltipTrigger>
          <TooltipContent className="bg-neutral-950 text-white text-xs border-neutral-800">
            <p>{isDeafened ? "Undeafen Audio" : "Deafen Audio"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                onClick={onLeave}
                variant="destructive"
                className="h-11 w-11 rounded-full bg-red-500 hover:bg-red-600 text-white cursor-pointer transition-all"
              />
            }
          >
            <PhoneOff className="h-5 w-5" />
          </TooltipTrigger>
          <TooltipContent className="bg-neutral-950 text-white text-xs border-neutral-800">
            <p>Leave Room</p>
          </TooltipContent>
        </Tooltip>

        {isOwner && onEnd && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={onEnd}
                  variant="destructive"
                  className="h-11 w-11 rounded-full bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-all"
                />
              }
            >
              <Trash2 className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-950 text-white text-xs border-neutral-800">
              <p>End Room for All</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
