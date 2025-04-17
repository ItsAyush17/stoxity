
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TweetInsight } from "@/types";
import { FileText, Calendar, ChartBarIcon, AlertCircle, TrendingUp } from "lucide-react";

interface InsightTweetsProps {
  tweets: TweetInsight[];
}

export const InsightTweets: React.FC<InsightTweetsProps> = ({ tweets }) => {
  // Group tweets by category
  const groupedTweets = {
    financial: tweets.filter(tweet => tweet.category === "financial"),
    growth: tweets.filter(tweet => tweet.category === "growth"),
    risk: tweets.filter(tweet => tweet.category === "risk"),
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "financial":
        return <ChartBarIcon className="h-5 w-5 text-primary" />;
      case "growth":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "risk":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "financial":
        return "bg-retro-blue/30 border-primary/20";
      case "growth":
        return "bg-retro-yellow/30 border-green-500/20";
      case "risk":
        return "bg-retro-pink/30 border-amber-500/20";
      default:
        return "bg-muted border-muted-foreground/20";
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTweets).map(([category, categoryTweets]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
            {getCategoryIcon(category)}
            {category} Insights
          </h3>
          
          {categoryTweets.map((tweet) => (
            <Card 
              key={tweet.id} 
              className={`border-2 ${getCategoryColor(category)}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">@StoxityAI</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{tweet.timestamp}</span>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed font-mono">{tweet.content}</p>
                
                <div className="mt-3 pt-2 border-t border-dashed border-muted">
                  <div className="flex justify-end gap-4">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {Math.floor(Math.random() * 100)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {Math.floor(Math.random() * 20)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {Math.floor(Math.random() * 50)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};
