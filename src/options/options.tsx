import React, { useEffect, useState } from 'react';
import { ShieldBan, Settings, Trash2, AlertCircle, ExternalLink, Lock } from 'lucide-react';
import { BlockedSite } from '@/types';
import { AddSiteForm } from '@/components/add-site-form';
import { AddExceptionForm } from '@/components/add-exception-form';
import { ExceptionList } from '@/components/exception-list';
import { getBlocklist, addBlockedSite, removeBlockedSite, addException, removeException } from '@/utils/storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export const Options: React.FC = () => {
  const [sites, setSites] = useState<BlockedSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showSitesInPopup, setShowSitesInPopup] = useState(false);

  useEffect(() => {
    loadSites();
    loadSettings();
  }, []);

  const loadSites = async () => {
    const blocklist = await getBlocklist();
    setSites(blocklist.sites);
  };

  const loadSettings = async () => {
    const settings = await chrome.storage.sync.get(['showSitesInPopup']);
    setShowSitesInPopup(settings.showSitesInPopup ?? false);
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

  const selectedSiteData = sites.find((site) => site.domain === selectedSite);

  return (
    <div className='min-h-screen bg-background py-8'>
      <div className='mx-auto max-w-4xl space-y-4 px-4'>
        <div className='mb-8 flex flex-col items-center justify-center gap-3 text-center'>
          <div className='rounded-full bg-primary/10 p-4'>
            <ShieldBan className='text-primary' size={32} />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>Easy Website Blocker</h1>
            <p className='text-lg text-muted-foreground'>Block distracting websites and stay focused</p>
          </div>
        </div>

        <div>
          <Card className='border-primary/10 bg-gradient-to-b from-primary/5 to-transparent'>
            <CardContent className='flex items-center justify-between py-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-primary/10 p-2'>
                  <Settings size={18} className='text-primary' />
                </div>
                <div>
                  <p className='font-medium'>Quick Access</p>
                  <p className='text-sm text-muted-foreground'>
                    Show blocked websites in the popup menu for quick management
                  </p>
                </div>
              </div>
              <Switch checked={showSitesInPopup} onCheckedChange={handleToggleShowSites} />
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Lock size={20} className='text-primary' />
                Blocked Websites
              </CardTitle>
              <CardDescription>Add websites you want to avoid visiting</CardDescription>
            </CardHeader>
            <CardContent>
              <AddSiteForm onAdd={handleAddSite} />
              <Separator className='my-4' />
              <ScrollArea className='h-[400px] pr-4'>
                <div className='space-y-2'>
                  {sites.length === 0 ? (
                    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 py-8 text-center'>
                      <AlertCircle className='mb-2 h-12 w-12 text-muted-foreground/50' />
                      <p className='font-medium text-muted-foreground'>No websites blocked</p>
                      <p className='text-sm text-muted-foreground/75'>Add a website above to start blocking</p>
                    </div>
                  ) : (
                    sites.map((site) => (
                      <Card
                        key={site.domain}
                        className={`cursor-pointer transition-colors duration-200 ${
                          selectedSite === site.domain
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedSite(site.domain)}
                      >
                        <CardContent className='flex items-center justify-between p-3'>
                          <div>
                            <p className='font-medium text-foreground'>{site.domain}</p>
                            <p className='text-sm text-muted-foreground'>
                              {site.exceptions.length} exception{site.exceptions.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSite(site.domain);
                            }}
                            className='h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
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

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
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
                  ? 'Add specific pages you want to keep accessible on this website'
                  : 'Select a blocked website to manage which pages should remain accessible'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSite ? (
                <div className='space-y-4'>
                  <AddExceptionForm onAdd={handleAddException} />
                  <Separator className='my-4' />
                  <ScrollArea className='h-[400px]'>
                    {selectedSiteData?.exceptions.length === 0 ? (
                      <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 py-8 text-center'>
                        <Settings className='mb-2 h-12 w-12 text-muted-foreground/50' />
                        <p className='font-medium text-muted-foreground'>No pages allowed yet</p>
                        <p className='text-sm text-muted-foreground/75'>Add pages you want to keep accessible</p>
                      </div>
                    ) : (
                      <ExceptionList exceptions={selectedSiteData?.exceptions || []} onRemove={handleRemoveException} />
                    )}
                  </ScrollArea>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 py-12 text-center'>
                  <Settings size={48} className='mb-4 text-muted-foreground/50' />
                  <p className='font-medium text-muted-foreground'>Choose a website</p>
                  <p className='text-sm text-muted-foreground/75'>
                    Select a blocked website from the left to manage allowed pages
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
