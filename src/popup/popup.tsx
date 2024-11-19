import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { BlockedSite } from '@/types';
import { AddSiteForm } from '@/components/add-site-form';
import { BlockedSiteList } from '@/components/blocked-site-list';
import { getBlocklist, addBlockedSite, removeBlockedSite } from '@/utils/storage';
import { ShieldBan, ShieldCheck, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { getSettings } from '@/utils/storage';
import { normalizeDomain } from '@/utils/rules';

export const Popup: React.FC = () => {
  const [sites, setSites] = useState<BlockedSite[]>([]);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [showSites, setShowSites] = useState(false);
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(true);
  const [showBlockingToggle, setShowBlockingToggle] = useState(false);

  useEffect(() => {
    loadSites();
    loadSettings();
    getCurrentTab();
  }, []);

  const getCurrentTab = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.url) {
      try {
        const url = new URL(tabs[0].url);
        setCurrentDomain(normalizeDomain(url.hostname));
      } catch (e) {
        console.error('Invalid URL:', e);
      }
    }
  };

  const loadSettings = async () => {
    const settings = await getSettings();
    setShowSites(settings.showSitesInPopup);
    setIsBlockingEnabled(settings.isBlockingEnabled);
    setShowBlockingToggle(settings.showBlockingToggleInPopup);
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

  const handleToggleBlocking = async (checked: boolean) => {
    setIsBlockingEnabled(checked);
    await chrome.storage.sync.set({ isBlockingEnabled: checked });
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
        {showBlockingToggle && (
          <>
            <Card
              className={cn(
                'border-primary/10 bg-gradient-to-b',
                isBlockingEnabled ? 'from-primary/5 to-transparent' : 'from-destructive/5 to-transparent',
              )}
            >
              <CardContent className='flex items-center justify-between p-3'>
                <div className='flex items-center gap-2'>
                  <ShieldCheck
                    className={cn('h-5 w-5', isBlockingEnabled ? 'text-primary' : 'text-muted-foreground')}
                  />
                  <div className='space-y-0.5'>
                    <span className='text-sm font-medium'>Website Blocking</span>
                    <p className='text-xs text-muted-foreground'>{isBlockingEnabled ? 'Active' : 'Disabled'}</p>
                  </div>
                </div>
                <Switch checked={isBlockingEnabled} onCheckedChange={handleToggleBlocking} />
              </CardContent>
            </Card>
            <Separator />
          </>
        )}

        <AddSiteForm onAdd={handleAddSite} initialDomain={currentDomain} />
        {showSites ? (
          <BlockedSiteList sites={sites} onRemove={handleRemoveSite} />
        ) : (
          <>
            <Separator className='my-2' />
            <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-border/50 bg-gradient-to-b from-muted/50 to-muted py-6 text-center shadow-sm'>
              <div className={cn('rounded-full', isBlockingEnabled ? 'bg-primary/10' : 'bg-destructive/10')}>
                <ShieldCheck className={cn('h-6 w-6', isBlockingEnabled ? 'text-primary' : 'text-muted-foreground')} />
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-semibold text-foreground'>
                  {sites.length} website{sites.length !== 1 ? 's' : ''} blocked
                </p>
                <p className='px-4 text-sm text-muted-foreground'>
                  {isBlockingEnabled ? "You're protected from distracting websites" : 'Blocking is currently disabled'}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <Button variant='ghost' size='sm' className='text-muted-foreground hover:text-foreground' asChild>
          <a href='options.html' target='_blank' className='flex items-center gap-1'>
            More Options
            <ExternalLink className='ml-1 h-3 w-3' />
          </a>
        </Button>
        <div className='w-full pt-1'>
          <Separator />
          <a
            href='https://github.com/aleksa-codes'
            target='_blank'
            rel='noopener noreferrer'
            className='mt-2 flex items-center justify-center text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground'
          >
            Created by
            <span className='ml-1 font-medium hover:text-primary'>aleksa.codes</span>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};
