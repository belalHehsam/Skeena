import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function RootErrorBoundary() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1>{"Something went wrong"}</h1>
      <p>{"An unexpected error occurred."}</p>
      <Button onClick={() => navigate("/")}>Go home</Button>
    </div>
  );
}
