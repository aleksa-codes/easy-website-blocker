import { BlocklistState } from '@/types';

// Helper to normalize domain for consistent matching
export const normalizeDomain = (domain: string): string => {
  return domain.replace(/^www\./, '');
};

export const generateRules = (blocklist: BlocklistState): chrome.declarativeNetRequest.Rule[] => {
  let ruleId = 1;
  const rules: chrome.declarativeNetRequest.Rule[] = [];

  blocklist.sites.forEach((site) => {
    const normalizedDomain = normalizeDomain(site.domain);

    // Block rule for the main domain
    rules.push({
      id: ruleId++,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          url: `${chrome.runtime.getURL('blocked.html')}?url=${encodeURIComponent(normalizedDomain)}`,
        },
      },
      condition: {
        urlFilter: `||${normalizedDomain}`,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        excludedRequestDomains: [chrome.runtime.id], // Prevent redirect loops
      },
    });

    // Allow rules for exceptions with higher priority
    site.exceptions.forEach((exception) => {
      rules.push({
        id: ruleId++,
        priority: 2,
        action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
        condition: {
          urlFilter: `||${normalizedDomain}/${exception}`,
          resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
        },
      });
    });
  });

  return rules;
};

export const updateBlockingRules = async (rules: chrome.declarativeNetRequest.Rule[]): Promise<void> => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: (await chrome.declarativeNetRequest.getDynamicRules()).map((rule) => rule.id),
    addRules: rules,
  });
};
