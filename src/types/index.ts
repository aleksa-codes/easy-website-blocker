export interface BlockedSite {
  domain: string;
  timestamp: number;
  exceptions: string[];
}

export interface BlocklistState {
  sites: BlockedSite[];
}
