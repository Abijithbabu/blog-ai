import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "./ui/progress";
import { Sparkles, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface Props {
  loading: boolean;
}

const progress = [
  {
    id: 1,
    title: "Initializing Research",
    description: "Setting up the research environment...",
    steps: [
      "Loading AI models...",
      "Preparing content analysis tools...",
      "Initializing SEO optimization engine...",
    ],
  },
  {
    id: 2,
    title: "Topic Analysis",
    description: "Analyzing the topic and gathering insights...",
    steps: [
      "Researching related topics...",
      "Identifying key themes and concepts...",
      "Analyzing competitor content...",
      "Gathering relevant statistics and data...",
    ],
  },
  {
    id: 3,
    title: "Content Generation",
    description: "Creating the initial content draft...",
    steps: [
      "Generating content structure...",
      "Writing main sections...",
      "Adding supporting details...",
      "Incorporating keywords naturally...",
      "Optimizing for readability...",
    ],
  },
  {
    id: 4,
    title: "Content Enhancement",
    description: "Improving and expanding the content...",
    steps: [
      "Expanding key sections...",
      "Adding relevant examples...",
      "Incorporating industry insights...",
      "Enhancing readability...",
      "Optimizing for SEO...",
    ],
  },
  {
    id: 5,
    title: "SEO Optimization",
    description: "Optimizing content for search engines...",
    steps: [
      "Analyzing keyword density...",
      "Optimizing meta descriptions...",
      "Structuring headings...",
      "Adding internal linking suggestions...",
      "Checking content length...",
    ],
  },
  {
    id: 6,
    title: "Quality Review",
    description: "Performing final quality checks...",
    steps: [
      "Checking content accuracy...",
      "Verifying SEO requirements...",
      "Ensuring proper formatting...",
      "Reviewing readability scores...",
      "Finalizing content structure...",
    ],
  },
];

// Utility function to get random number between min and max
const getRandomInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const LoadingResponse = ({ loading }: Props) => {
  const [isOpen, setIsOpen] = useState(loading);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string>("");

  useEffect(() => {
    if (loading) {
      setIsOpen(true);
    }
    if (!loading) {
      setIsFastForwarding(true);
      const totalSteps = progress.length;
      const fastForwardInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            clearInterval(fastForwardInterval);
            setIsClosing(true);
            return prev;
          }
          return prev + 1;
        });
        setCurrentSubStep(0);
      }, 300);

      const timer = setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
        setIsFastForwarding(false);
        setCurrentStep(0);
        setCurrentSubStep(0);
        setProgressValue(0);
      }, 3000);

      return () => {
        clearInterval(fastForwardInterval);
        clearTimeout(timer);
      };
    }

    const totalSteps = progress.length;
    let startTime = Date.now();

    const updateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000; // in seconds
      const estimatedTotalTime = 180; // 3 minutes in seconds
      const remainingTime = Math.max(0, estimatedTotalTime - elapsed);
      setEstimatedTime(Math.ceil(remainingTime).toString());

      setProgressValue((prev) => {
        const newValue = prev + 100 / (totalSteps * 10);
        return Math.min(newValue, 100);
      });
    };

    const progressInterval = setInterval(
      updateProgress,
      getRandomInterval(2000, 8000)
    );

    const updateStep = () => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
      setCurrentSubStep(0);
    };

    const stepInterval = setInterval(
      updateStep,
      getRandomInterval(20000, 30000)
    );

    const updateSubStep = () => {
      setCurrentSubStep((prev) => {
        const currentProgress = progress[currentStep];
        if (!currentProgress.steps) return 0;
        if (prev >= currentProgress.steps.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    };

    const subStepInterval = setInterval(
      updateSubStep,
      getRandomInterval(2000, 5000)
    );

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearInterval(subStepInterval);
    };
  }, [loading]);

  const currentProgress = progress[currentStep];
  const currentSubStepText = currentProgress.steps?.[currentSubStep] || "";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only allow closing if we're in the closing state
        if (!open && !isClosing) {
          return;
        }
        setIsOpen(open);
      }}
    >
      <DialogContent
        className="sm:max-w-[500px] [&>button]:hidden"
        onPointerDownOutside={(e) => {
          // Prevent closing on outside click
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing on escape key
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-medium tracking-normal">
            {isClosing ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                Content Generated Successfully!
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                {currentProgress.title}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isClosing
              ? "Your content is ready to use. You can now view and edit it."
              : currentProgress.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progressValue)}%</span>
            </div>
            <Progress
              value={isClosing ? 100 : progressValue}
              className="w-full h-4 bg-primary/10"
            />
          </div>

          {!isClosing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated time remaining: {estimatedTime}s</span>
            </div>
          )}

          {currentSubStepText && !isClosing && (
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <p
                className={`text-sm ${
                  isFastForwarding ? "animate-none" : "animate-pulse"
                }`}
              >
                {currentSubStepText}
              </p>
            </div>
          )}

          {isClosing && (
            <div className="space-y-2 rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-800 dark:text-green-500" />
                <p className="text-sm font-medium text-green-800 dark:text-green-500">
                  Content generation completed
                </p>
              </div>
              <p className="text-sm text-green-800 dark:text-green-500">
                Your content has been generated and is ready for review.
              </p>
            </div>
          )}

          {!isClosing && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>
                Please don't close this window while content is being generated.
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          {isClosing && (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Review Content
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingResponse;
