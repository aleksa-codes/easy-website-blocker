import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ShieldBan,
  ShieldCheck,
  Settings,
  Trash2,
  AlertCircle,
  ExternalLink,
  Lock,
  Globe,
  PanelTop,
  MousePointerClick,
  FileText,
} from 'lucide-react';
import { BlockedSite } from '@/types';
import { AddSiteForm } from '@/components/add-site-form';
import { AddExceptionForm } from '@/components/add-exception-form';
import { ExceptionList } from '@/components/exception-list';
import {
  getBlocklist,
  addBlockedSite,
  removeBlockedSite,
  addException,
  removeException,
  getSettings,
} from '@/utils/storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

export const Options: React.FC = () => {
  const [sites, setSites] = useState<BlockedSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showSitesInPopup, setShowSitesInPopup] = useState(false);
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(true);
  const [showBlockingToggleInPopup, setShowBlockingToggleInPopup] = useState(false);

  useEffect(() => {
    loadSites();
    loadSettings();
  }, []);

  const loadSites = async () => {
    const blocklist = await getBlocklist();
    setSites(blocklist.sites);
  };

  const loadSettings = async () => {
    const settings = await getSettings();
    setShowSitesInPopup(settings.showSitesInPopup);
    setIsBlockingEnabled(settings.isBlockingEnabled);
    setShowBlockingToggleInPopup(settings.showBlockingToggleInPopup);
  };

  const handleToggleShowSites = async (checked: boolean) => {
    setShowSitesInPopup(checked);
    await chrome.storage.sync.set({ showSitesInPopup: checked });
  };

  const handleAddSite = async (domain: string) => {
    await addBlockedSite(domain);
    await loadSites();
  };

  const handleRemoveSite = async (domain: string) => {
    await removeBlockedSite(domain);
    setSelectedSite(null);
    await loadSites();
  };

  const handleAddException = async (path: string) => {
    if (selectedSite) {
      await addException(selectedSite, path);
      await loadSites();
    }
  };

  const handleRemoveException = async (path: string) => {
    if (selectedSite) {
      await removeException(selectedSite, path);
      await loadSites();
    }
  };

  const handleToggleBlocking = async (checked: boolean) => {
    setIsBlockingEnabled(checked);
    await chrome.storage.sync.set({ isBlockingEnabled: checked });
  };

  const handleToggleBlockingInPopup = async (checked: boolean) => {
    setShowBlockingToggleInPopup(checked);
    await chrome.storage.sync.set({ showBlockingToggleInPopup: checked });
  };

  const selectedSiteData = sites.find((site) => site.domain === selectedSite);

  return (
    <div className='bg-background min-h-screen'>
      <div className='mx-auto max-w-4xl space-y-4 px-4 py-8'>
        <div className='mb-8 flex flex-col items-center justify-center gap-3 text-center'>
          <div className='bg-primary/10 rounded-full p-5'>
            <ShieldBan className='text-primary' size={32} />
          </div>
          <div>
            <h1 className='text-foreground text-2xl font-bold'>Easy Website Blocker</h1>
            <p className='text-muted-foreground text-sm'>Block distracting websites and stay focused</p>
          </div>
        </div>

        <div className='space-y-4'>
          <Card className='border-primary/10'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Settings size={20} className='text-primary' />
                Extension Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Card
                  className={cn(
                    'border-primary/10 shadow-sm transition-all hover:shadow-md',
                    isBlockingEnabled
                      ? 'from-primary/10 via-primary/5 to-transparent'
                      : 'from-destructive/10 via-destructive/5 to-transparent',
                  )}
                >
                  <CardContent className='p-4'>
                    <div className='mb-3 flex items-center gap-2'>
                      <ShieldCheck
                        className={cn('h-5 w-5', isBlockingEnabled ? 'text-primary' : 'text-muted-foreground')}
                      />
                      <span className='font-medium'>Website Blocking</span>
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                      <p className='text-muted-foreground text-sm'>
                        {isBlockingEnabled
                          ? 'Blocking is active and protecting you from distractions'
                          : 'Blocking is currently disabled'}
                      </p>
                      <Switch
                        checked={isBlockingEnabled}
                        onCheckedChange={handleToggleBlocking}
                        className='data-[state=checked]:bg-primary'
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-primary/10 shadow-sm transition-all hover:shadow-md'>
                  <CardContent className='p-4'>
                    <div className='mb-3 flex items-center gap-2'>
                      <PanelTop className='text-primary h-5 w-5' />
                      <span className='font-medium'>Popup Menu Settings</span>
                    </div>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between gap-4'>
                        <label className='text-muted-foreground text-sm' htmlFor='show-sites'>
                          Show blocked sites list in popup
                        </label>
                        <Switch
                          id='show-sites'
                          checked={showSitesInPopup}
                          onCheckedChange={handleToggleShowSites}
                          className='data-[state=checked]:bg-primary'
                        />
                      </div>
                      <div className='flex items-center justify-between gap-4'>
                        <label className='text-muted-foreground text-sm' htmlFor='quick-toggle'>
                          Show blocking toggle in popup
                        </label>
                        <Switch
                          id='quick-toggle'
                          checked={showBlockingToggleInPopup}
                          onCheckedChange={handleToggleBlockingInPopup}
                          className='data-[state=checked]:bg-primary'
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Card className='border-primary/10'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Lock size={20} className='text-primary' />
                Blocked Websites
              </CardTitle>
              <CardDescription>Add websites you want to avoid visiting</CardDescription>
            </CardHeader>
            <CardContent>
              <AddSiteForm onAdd={handleAddSite} />
              <Separator className='my-4' />
              <ScrollArea className='border-border/50 h-[400px] rounded-md border pr-4'>
                <div className='space-y-2 p-3'>
                  {sites.length === 0 ? (
                    <div className='border-muted-foreground/25 bg-muted/50 flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center'>
                      <AlertCircle className='text-muted-foreground/50 mb-2 h-12 w-12' />
                      <p className='text-muted-foreground font-medium'>No websites blocked</p>
                      <p className='text-muted-foreground/75 text-sm'>Add a website above to start blocking</p>
                    </div>
                  ) : (
                    sites.map((site) => (
                      <Card
                        key={site.domain}
                        className={cn(
                          'cursor-pointer transition-colors duration-200',
                          selectedSite === site.domain
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50 hover:bg-muted/50',
                        )}
                        onClick={() => setSelectedSite(site.domain)}
                      >
                        <CardContent className='flex items-center justify-between p-3'>
                          <div className='flex items-center gap-2'>
                            <Globe className='text-muted-foreground h-4 w-4' />
                            <div>
                              <p className='text-foreground font-medium'>{site.domain}</p>
                              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                <span>{formatDistanceToNow(site.timestamp, { addSuffix: true })}</span>
                                <span>•</span>
                                <span>
                                  {site.exceptions.length} exception{site.exceptions.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSite(site.domain);
                            }}
                            className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8'
                          >
                            <Trash2 size={16} />
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className='border-primary/10'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <ExternalLink size={20} className='text-primary' />
                {selectedSite ? (
                  <>
                    Allowed Pages for <span className='text-primary'>{selectedSite}</span>
                  </>
                ) : (
                  'Allowed Pages'
                )}
              </CardTitle>
              <CardDescription>
                {selectedSite
                  ? 'Add pages that should remain accessible on this website'
                  : 'Manage exceptions for blocked websites'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSite ? (
                <div className='space-y-4'>
                  <AddExceptionForm onAdd={handleAddException} />
                  <Separator className='my-4' />
                  <ScrollArea className='border-border/50 h-[400px] rounded-md border'>
                    <div className='p-3'>
                      {selectedSiteData?.exceptions.length === 0 ? (
                        <div className='border-muted-foreground/25 bg-muted/50 flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center'>
                          <FileText className='text-muted-foreground mb-2 h-12 w-12 opacity-50' />
                          <p className='text-muted-foreground font-medium'>No exceptions added</p>
                          <p className='text-muted-foreground/75 text-sm'>Add paths you want to keep accessible</p>
                        </div>
                      ) : (
                        <ExceptionList
                          exceptions={selectedSiteData?.exceptions || []}
                          onRemove={handleRemoveException}
                        />
                      )}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className='border-muted-foreground/25 bg-muted/50 flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center'>
                  <MousePointerClick size={48} className='text-muted-foreground/50 mb-4' />
                  <p className='text-muted-foreground font-medium'>No website selected</p>
                  <p className='text-muted-foreground/75 text-sm'>
                    Select a website from the left to manage its exceptions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <footer className='mt-12 flex items-center justify-center text-center'>
          <a
            href='https://github.com/aleksa-codes'
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground/60 hover:text-muted-foreground flex items-center gap-1 text-sm transition-colors'
          >
            Created by
            <span className='hover:text-primary font-medium'>aleksa.codes</span>
          </a>
        </footer>
      </div>
    </div>
  );
};
