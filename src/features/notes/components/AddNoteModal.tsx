/**
 * Modal for adding a new significant note
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { significantNoteSchema, SignificantNoteFormData } from '../validation/noteSchema';

interface AddNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SignificantNoteFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function AddNoteModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AddNoteModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignificantNoteFormData>({
    resolver: zodResolver(significantNoteSchema),
  });

  const handleFormSubmit = async (data: SignificantNoteFormData) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Significant Note</DialogTitle>
          <DialogDescription>
            Record a significant incident or note about the student. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note">Note / Incident Description *</Label>
            <Textarea
              id="note"
              placeholder="Describe the incident or observation..."
              rows={4}
              {...register('note')}
              className={errors.note ? 'border-red-500' : ''}
            />
            {errors.note && (
              <p className="text-sm text-red-500">{errors.note.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Action Taken / Remarks *</Label>
            <Textarea
              id="remarks"
              placeholder="Describe the action taken or additional remarks..."
              rows={4}
              {...register('remarks')}
              className={errors.remarks ? 'border-red-500' : ''}
            />
            {errors.remarks && (
              <p className="text-sm text-red-500">{errors.remarks.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
