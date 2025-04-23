import React from "react";
import { AlertCircle } from "lucide-react";

interface CompanyNotFoundProps {
  searchQuery: string;
}

export const CompanyNotFound: React.FC<CompanyNotFoundProps> = ({ searchQuery }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-mono mb-4">Company Not Found</h2>
      <p className="text-muted-foreground font-mono mb-4">
        Sorry, we couldn't find "{searchQuery}" in our database.
      </p>
      <div className="max-w-md text-sm text-muted-foreground font-mono">
        <p className="mb-2">
          We're continuously expanding our coverage to include more companies and provide comprehensive insights.
        </p>
        <p>
          In the meantime, please try searching for another company from our suggestions list.
        </p>
      </div>
    </div>
  );
}; 