import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldBan } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Blocked() {
  const [blockedUrl, setBlockedUrl] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get('url');
    if (url) {
      setBlockedUrl(url);
    }
  }, []);

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-4'>
          <div className='flex justify-center'>
            <ShieldBan className='text-primary h-12 w-12' />
          </div>
          <div>
            <CardTitle className='text-center text-2xl'>Website Blocked</CardTitle>
            <CardDescription className='mt-2 text-center text-base'>
              This website has been blocked by Easy Website Blocker
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            <div className='bg-muted rounded-lg p-4'>
              <p className='text-muted-foreground text-center text-sm break-all'>
                Blocked website:
                <span className='text-foreground mt-1 block font-medium'>{blockedUrl}</span>
              </p>
            </div>
            <div className='flex justify-center'>
              <Button variant='default' size='lg' onClick={() => window.close()} className='px-8'>
                Close Tab
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
