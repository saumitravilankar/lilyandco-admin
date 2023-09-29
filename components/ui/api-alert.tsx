import { Copy, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";

interface APIAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const APIAlert: React.FC<APIAlertProps> = ({ title, description, variant }) => {
  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success("API Route copied to clipboard");
  };

  return (
    <div>
      <Alert>
        <Server className="h-4 w-4" />
        <AlertTitle className="flex items-center gap-2">
          {title}
          <Badge
            className="text-xs"
            variant={variant === "public" ? "secondary" : "destructive"}
          >
            {variant}
          </Badge>
        </AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <code className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            <p>{description}</p>
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopy(description)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default APIAlert;
