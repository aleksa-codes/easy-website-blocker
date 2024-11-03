import React, { useEffect, useState } from 'react';
import { BlockedSite } from '@/types';
import { AddSiteForm } from '@/components/add-site-form';
import { BlockedSiteList } from '@/components/blocked-site-list';
import { getBlocklist, addBlockedSite, removeBlockedSite } from '@/utils/storage';
import { ShieldBan, ShieldCheck, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Popup: React.FC = () => {
  const [sites, setSites] = useState<BlockedSite[]>([]);
  const [showSites, setShowSites] = useState(false);

  useEffect(() => {
    loadSites();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await chrome.storage.sync.get(['showSitesInPopup']);
    setShowSites(settings.showSitesInPopup ?? false);
  };

  const loadSites = async () => {
    const blocklist = await getBlocklist();
    setSites(blocklist.sites);
  };

  const handleAddSite = async (domain: string) => {
    await addBlockedSite(domain);
    await loadSites();
  };

  const handleRemoveSite = async (domain: string) => {
    await removeBlockedSite(domain);
    await loadSites();
  };

  return (
    <Card className='w-80'>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2'>
          <ShieldBan className='text-primary' size={24} />
          <span className='text-xl font-bold'>Easy Website Blocker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <AddSiteForm onAdd={handleAddSite} />
        {showSites ? (
          <BlockedSiteList sites={sites} onRemove={handleRemoveSite} />
        ) : (
          <>
            <Separator className='my-2' />
            <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-border/50 bg-gradient-to-b from-muted/50 to-muted py-6 text-center shadow-sm'>
              <div className='rounded-full bg-primary/10 p-3'>
                <ShieldCheck className='h-6 w-6 text-primary' />
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-semibold text-foreground'>
                  {sites.length} website{sites.length !== 1 ? 's' : ''} blocked
                </p>
                <p className='px-4 text-sm text-muted-foreground'>You're protected from distracting websites</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className='flex justify-end pt-2'>
        <Button variant='ghost' size='sm' className='text-muted-foreground hover:text-foreground' asChild>
          <a href='options.html' target='_blank' className='flex items-center gap-1'>
            More Options
            <ExternalLink className='ml-1 h-3 w-3' />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
