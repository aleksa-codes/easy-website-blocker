import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  onAdd: (exception: string) => void;
}

export const AddExceptionForm: React.FC<Props> = ({ onAdd }) => {
  const [path, setPath] = useState('');
  const [error, setError] = useState<string>('');

  const standardizePath = (input: string): string => {
    // Remove leading and trailing slashes, collapse multiple slashes
    return input
      .trim()
      .replace(/^\/+|\/+$/g, '')
      .replace(/\/+/g, '/');
  };

  const isValidPath = (path: string): boolean => {
    // Updated regex to allow:
    // - @ symbols (for social media handles)
    // - % for URL encoded characters
    // - = and & for query parameters
    // - # for hash fragments
    // - ~ for user directories
    // - + for spaces in URLs
    // - : for parameters
    // - , for lists
    const pathRegex = /^[@a-zA-Z0-9-_.~+:,=%&/#]+$/;

    // Additional checks for common patterns
    if (path.includes('//')) return false; // No double slashes
    if (path.endsWith('.')) return false; // No trailing dots

    return pathRegex.test(path);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const standardizedPath = standardizePath(path.trim());

    if (!standardizedPath) {
      setError('Please enter a page address');
      return;
    }

    if (!isValidPath(standardizedPath)) {
      setError('This page address contains invalid characters. Please use only letters, numbers, and common symbols');
      return;
    }

    onAdd(standardizedPath);
    setPath('');
  };

  return (
    <div className='space-y-2'>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <div className='relative flex-1'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>/</span>
          <Input
            type='text'
            value={path}
            onChange={(e) => {
              setPath(e.target.value);
              setError('');
            }}
            placeholder='Page to allow (e.g. profile or news/latest)'
            className={`pl-6 ${error ? 'border-red-500' : ''}`}
          />
        </div>
        <Button type='submit' variant='default'>
          Allow
        </Button>
      </form>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
};
