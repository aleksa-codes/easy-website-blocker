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
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-4'>
          <div className='flex justify-center'>
            <ShieldBan className='h-12 w-12 text-primary' />
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
            <div className='rounded-lg bg-muted p-4'>
              <p className='break-all text-center text-sm text-muted-foreground'>
                Blocked website:
                <span className='mt-1 block font-medium text-foreground'>{blockedUrl}</span>
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
