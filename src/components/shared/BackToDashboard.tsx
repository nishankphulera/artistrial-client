import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft } from 'lucide-react';

interface BackToDashboardProps {
  hasUnsavedChanges: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const BackToDashboard: React.FC<BackToDashboardProps> = ({ 
  hasUnsavedChanges, 
  className = "",
  variant = "outline"
}) => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (!hasUnsavedChanges) {
    return (
      <Button 
        type="button" 
        variant={variant} 
        onClick={handleBackToDashboard}
        className={`flex items-center gap-2 ${className}`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          type="button" 
          variant={variant}
          className={`flex items-center gap-2 ${className}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-title">Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes in your form. If you go back to the dashboard now, 
            all your progress will be lost. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay on Form</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleBackToDashboard}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

