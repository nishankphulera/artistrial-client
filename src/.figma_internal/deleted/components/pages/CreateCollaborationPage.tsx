import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { CreateCollaborationForm } from '../forms/CreateCollaborationForm';

interface CreateCollaborationPageProps {
  isDashboardDarkMode?: boolean;
}

export function CreateCollaborationPage({ isDashboardDarkMode = false }: CreateCollaborationPageProps) {
  const router = useRouter();

  return (
    <div className={`container mx-auto px-4 py-8 ${isDashboardDarkMode ? 'bg-[#171717] text-white' : ''}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/collaborations/browse')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collaborations
          </Button>
        </div>
        <div>
          <h1 className="font-title text-3xl mb-2">Create New Collaboration</h1>
          <p className="text-muted-foreground">
            Start a new collaboration project and find talented professionals to work with.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <CreateCollaborationForm />
      </div>
    </div>
  );
}

