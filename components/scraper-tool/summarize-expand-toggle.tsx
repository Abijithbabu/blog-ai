"use client";

import { Button } from "@/components/ui/button";
import { Minimize, Maximize } from "lucide-react";

interface SummarizeExpandToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function SummarizeExpandToggle({
  isExpanded,
  onToggle,
}: SummarizeExpandToggleProps) {
  return (
    <Button variant="outline" size="sm" onClick={onToggle} className="h-8 px-2">
      {isExpanded ? (
        <>
          <Minimize className="mr-2 h-4 w-4" />
          Minimize
        </>
      ) : (
        <>
          <Maximize className="mr-2 h-4 w-4" />
          Expand
        </>
      )}
    </Button>
  );
}
