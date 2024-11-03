import { BlockedSite, BlocklistState } from '@/types';

export const getBlocklist = async (): Promise<BlocklistState> => {
  const result = await chrome.storage.local.get('blocklist');
  return result.blocklist || { sites: [] };
};

export const saveBlocklist = async (blocklist: BlocklistState): Promise<void> => {
  await chrome.storage.local.set({ blocklist });
};

export const addBlockedSite = async (domain: string): Promise<void> => {
  const blocklist = await getBlocklist();
  const newSite: BlockedSite = {
    domain,
    timestamp: Date.now(),
    exceptions: [],
  };

  blocklist.sites.push(newSite);
  await saveBlocklist(blocklist);
};

export const removeBlockedSite = async (domain: string): Promise<void> => {
  const blocklist = await getBlocklist();
  blocklist.sites = blocklist.sites.filter((site) => site.domain !== domain);
  await saveBlocklist(blocklist);
};

export const addException = async (domain: string, exception: string): Promise<void> => {
  const blocklist = await getBlocklist();
  const site = blocklist.sites.find((s) => s.domain === domain);

  if (site && !site.exceptions.includes(exception)) {
    site.exceptions.push(exception);
    await saveBlocklist(blocklist);
  }
};

export const removeException = async (domain: string, exception: string): Promise<void> => {
  const blocklist = await getBlocklist();
  const site = blocklist.sites.find((s) => s.domain === domain);

  if (site) {
    site.exceptions = site.exceptions.filter((e) => e !== exception);
    await saveBlocklist(blocklist);
  }
};
