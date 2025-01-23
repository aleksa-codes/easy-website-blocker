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
        <p className='text-muted-foreground text-center text-sm'>No blocked sites yet</p>
      ) : (
        <ScrollArea className='border-border/50 h-[240px] w-full rounded-md border'>
          <div className='space-y-1 p-3'>
            {sites.map((site) => (
              <div
                key={site.domain}
                className='bg-card hover:bg-muted/50 flex items-center justify-between rounded-md border px-3 py-1.5'
              >
                <div className='flex items-center gap-2'>
                  <Globe className='text-muted-foreground h-3.5 w-3.5' />
                  <div>
                    <p className='text-sm leading-none font-medium'>{site.domain}</p>
                    <p className='text-muted-foreground text-xs'>
                      {formatDistanceToNow(site.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => onRemove(site.domain)}
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-6 w-6 p-0'
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
