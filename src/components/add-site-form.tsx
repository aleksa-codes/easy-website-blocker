import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  onAdd: (domain: string) => void;
}

export const AddSiteForm: React.FC<Props> = ({ onAdd }) => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState<string>('');

  const standardizeDomain = (input: string): string => {
    // Remove protocol, www, and any paths/query params
    const cleaned = input
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .split(/[/?#]/)[0] // Remove everything after domain
      .replace(/\/+$/, ''); // Remove trailing slashes
    return cleaned;
  };

  const isValidDomain = (domain: string): boolean => {
    // Updated regex to handle more domain patterns including:
    // - Subdomains (e.g., sub.example.com)
    // - International domains
    // - Longer TLDs (.website, .company, etc)
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const standardizedDomain = standardizeDomain(domain.trim());

    if (!standardizedDomain) {
      setError('Please enter a domain');
      return;
    }

    if (!isValidDomain(standardizedDomain)) {
      setError('Please enter a valid domain (e.g. facebook.com)');
      return;
    }

    onAdd(standardizedDomain);
    setDomain('');
  };

  return (
    <div className='space-y-2'>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <Input
          type='text'
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            setError('');
          }}
          placeholder='Website (e.g. facebook.com)'
          className={`flex-1 ${error ? 'border-red-500' : ''}`}
        />
        <Button type='submit' size='icon' variant='default'>
          <Plus className='h-4 w-4' />
          <span className='sr-only'>Block website</span>
        </Button>
      </form>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
};
