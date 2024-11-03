import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { BlockedSite } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  sites: BlockedSite[];
  onRemove: (domain: string) => void;
}

export const BlockedSiteList: React.FC<Props> = ({ sites, onRemove }) => {
  return (
    <div className='mt-4'>
      {sites.length === 0 ? (
        <p className='text-center text-muted-foreground'>No blocked sites yet</p>
      ) : (
        <ScrollArea className='h-[300px] w-full rounded-md border'>
          <div className='p-4'>
            {sites.map((site) => (
              <Card key={site.domain} className='mb-2 last:mb-0'>
                <CardContent className='flex items-center justify-between p-3'>
                  <div>
                    <p className='font-medium text-foreground'>{site.domain}</p>
                    <p className='text-sm text-muted-foreground'>Blocked {formatDistanceToNow(site.timestamp)} ago</p>
                  </div>
                  <Button
                    onClick={() => onRemove(site.domain)}
                    variant='ghost'
                    size='icon'
                    className='text-muted-foreground hover:text-destructive'
                    aria-label='Remove site'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
