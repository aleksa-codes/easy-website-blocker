import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Globe } from 'lucide-react';
import { BlockedSite } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  sites: BlockedSite[];
  onRemove: (domain: string) => void;
}

export const BlockedSiteList: React.FC<Props> = ({ sites, onRemove }) => {
  return (
    <div className='mt-2'>
      {sites.length == 0 ? (
        <p className='text-center text-sm text-muted-foreground'>No blocked sites yet</p>
      ) : (
        <ScrollArea className='h-[240px] w-full rounded-md border border-border/50'>
          <div className='space-y-1 p-3'>
            {sites.map((site) => (
              <div
                key={site.domain}
                className='flex items-center justify-between rounded-md border bg-card px-3 py-1.5 hover:bg-muted/50'
              >
                <div className='flex items-center gap-2'>
                  <Globe className='h-3.5 w-3.5 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium leading-none'>{site.domain}</p>
                    <p className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(site.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => onRemove(site.domain)}
                  variant='ghost'
                  size='sm'
                  className='h-6 w-6 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                  aria-label='Remove site'
                >
                  <Trash2 className='h-3.5 w-3.5' />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
