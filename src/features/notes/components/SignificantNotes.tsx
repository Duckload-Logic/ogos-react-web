/**
 * Significant Notes component for IIR Profile
 * Only visible to Admin and Counselor roles
 */

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudentNotes, useCreateNote } from '../hooks/useNotes';
import { SignificantNoteFormData } from '../validation/noteSchema';
import AddNoteModal from './AddNoteModal';
import { formatDate } from '@/features/schedules/utils/formatters';
import CardBlock from '@/features/iir/components/profile/CardBlock';
import EmptyState from '@/features/iir/components/profile/EmptyState';
import InfoItem from '@/features/iir/components/profile/InfoItem';
import SectionTitle from '@/features/iir/components/profile/SectionTitle';
import { NOT_SPECIFIED } from '@/features/iir/constants';
import { LoadingSpinner } from '@/components/shared';

interface SignificantNotesProps {
  iirId: number;
  onToast: (message: string) => void;
}

export default function SignificantNotes({ iirId, onToast }: SignificantNotesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: notes, isLoading, isError } = useStudentNotes(iirId);

  const createNoteMutation = useCreateNote(
    iirId,
    () => {
      setIsModalOpen(false);
      onToast('✓ Note saved successfully!');
    },
    (error) => {
      const errorMessage =
        error?.response?.data?.error || 'Failed to save note. Please try again.';
      onToast(errorMessage);
    }
  );

  const handleSubmit = async (data: SignificantNoteFormData) => {
    await createNoteMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-card-foreground">
        Error loading significant notes.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <SectionTitle title="Significant Notes / Incidents" />
        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Note
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {(notes?.length ?? 0) > 0 ? (
          notes!.map((note) => (
            <CardBlock key={note.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <InfoItem
                  label="Created"
                  value={note.createdAt ? formatDate(note.createdAt) : NOT_SPECIFIED}
                />
                <InfoItem
                  label="Updated"
                  value={note.updatedAt ? formatDate(note.updatedAt) : NOT_SPECIFIED}
                />
              </div>
              <div className="space-y-3 border-t border-border pt-3">
                <InfoItem label="Note / Incident" value={note.note || NOT_SPECIFIED} />
                <InfoItem label="Action Taken / Remarks" value={note.remarks || NOT_SPECIFIED} />
              </div>
            </CardBlock>
          ))
        ) : (
          <EmptyState label="No significant notes recorded" />
        )}
      </div>

      <AddNoteModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createNoteMutation.isPending}
      />
    </div>
  );
}
