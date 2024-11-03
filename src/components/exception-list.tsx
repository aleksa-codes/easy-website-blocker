import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  exceptions: string[];
  onRemove: (exception: string) => void;
}

export const ExceptionList: React.FC<Props> = ({ exceptions, onRemove }) => {
  if (exceptions.length === 0) {
    return <p className='text-sm text-muted-foreground'>No exceptions added</p>;
  }

  return (
    <ul className='space-y-4'>
      {exceptions.map((exception) => (
        <li key={exception} className='flex items-center justify-between'>
          <Badge variant='secondary' className='text-sm'>
            /{exception}
          </Badge>
          <Button
            onClick={() => onRemove(exception)}
            variant='ghost'
            size='sm'
            className='h-6 w-6 p-0 text-muted-foreground hover:text-destructive'
            aria-label='Remove exception'
          >
            <X className='h-4 w-4' />
          </Button>
        </li>
      ))}
    </ul>
  );
};
