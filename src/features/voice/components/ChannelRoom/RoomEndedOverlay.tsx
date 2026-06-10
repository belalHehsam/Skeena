import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export function RoomEndedOverlay() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/voice", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
      <div className="bg-card text-card-foreground border rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-red-500/10 text-red-500 rounded-full h-14 w-14 flex items-center justify-center mx-auto mb-4">
          <LogOut className="h-6 w-6" />
        </div>
        <h3 className="font-heading text-lg font-bold text-neutral-800 dark:text-neutral-100">
          This room has ended
        </h3>
        <p className="text-sm text-neutral-500 mt-2">
          The host has closed the discussion, or all participants have left.
        </p>
        <div className="mt-6 text-xs font-semibold text-neutral-400 font-heading">
          Returning to channels list in {countdown}...
        </div>
      </div>
    </div>
  );
}
