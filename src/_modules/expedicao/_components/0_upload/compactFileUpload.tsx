import { CheckCircle, File, Upload, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/_shared/components/ui/button';

export interface FilesState {
  products: File | null;
  routes: File | null;
  shipments: File | null;
}

export const CompactFileUpload = ({
  id,
  title,
  icon: Icon,
  file,
  onChange,
  required = false,
}: {
  id: keyof FilesState;
  title: string;
  icon: any;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))
    ) {
      const mockEvent = {
        target: { files: [droppedFile] },
        currentTarget: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(mockEvent);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mockEvent = {
      target: { files: [] },
      currentTarget: { files: [] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(mockEvent);
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <File className='w-4 h-4 text-muted-foreground' />
        <label htmlFor={id} className='text-sm font-medium'>
          {title}
          {required && <span className='text-destructive ml-1'>*</span>}
        </label>
      </div>

      <label
        htmlFor={id}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer block ${
          isDragging
            ? 'border-primary bg-primary/5'
            : file
              ? 'border-green-300 bg-green-50/50'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={id}
          type='file'
          accept='.xlsx, .xls'
          onChange={onChange}
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
        />

        {file ? (
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 min-w-0'>
              <CheckCircle className='w-4 h-4 text-green-600 flex-shrink-0' />
              <span className='text-xs font-medium text-green-700 truncate'>
                {file.name}
              </span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRemove}
              className='h-6 w-6 p-0 text-muted-foreground hover:text-destructive'
            >
              <X className='w-3 h-3' />
            </Button>
          </div>
        ) : (
          <div className='flex items-center justify-center gap-2'>
            <Upload className='w-4 h-4 text-muted-foreground' />
            <span className='text-xs text-muted-foreground'>
              Clique ou arraste arquivo
            </span>
          </div>
        )}
      </label>
    </div>
  );
};
