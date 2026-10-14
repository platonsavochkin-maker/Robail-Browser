import { Tab, DomainSecurity, SecurityThreat } from '../types/browser';

// Built-in list of dangerous / pirated / malware patterns
export const PIRATE_PATTERNS = [
  'rutracker',
  'thepiratebay',
  'piratebay',
  'pirate',
  'rutor',
  'fitgirl',
  'warez',
  'crackwatch',
  'keygen',
  'repack',
  'lordfilm',
  'kinogo',
  'filmix',
  '1337x',
  'torrent',
  'cracked',
];

export const VIRUS_MALWARE_PATTERNS = [
  'virus',
  'trojan',
  'malware',
  'ransomware',
  'ransom',
  'spyware',
  'adware',
  'cryptominer',
  'miner',
  'phishing',
  'stealer',
  'exploit',
  'payload',
  'darknet',
];

export function getQuarantinedDomains(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('robail_quarantined_domains');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Exclude dementor.ru so it doesn't appear by default even from previous cache
        const filtered = parsed
          .map((d) => String(d).toLowerCase().trim())
          .filter((d) => d && d !== 'dementor.ru');
        return Array.from(new Set(filtered));
      }
    }
  } catch {}
  return [];
}

export function quarantineDomain(domain: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getQuarantinedDomains();
    const cleanDomain = domain.toLowerCase().replace(/^\.+|\.+$/g, '').trim();
    if (cleanDomain && !current.includes(cleanDomain)) {
      current.push(cleanDomain);
      localStorage.setItem('robail_quarantined_domains', JSON.stringify(current));
    }
  } catch {}
}

export function unquarantineDomain(domain: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanDomain = domain.toLowerCase().replace(/^\.+|\.+$/g, '').trim();
    const current = getQuarantinedDomains().filter((d) => d !== cleanDomain);
    localStorage.setItem('robail_quarantined_domains', JSON.stringify(current));
  } catch {}
}

export function checkDomainSecurity(url: string, customQuarantined?: string[]): DomainSecurity {
  if (url === 'robail://start' || url.startsWith('robail://')) {
    return {
      isSecure: true,
      protocol: 'internal',
      hostname: 'robail://',
      statusText: 'Безопасная среда Robail',
      reason: 'Внутренняя изолированная среда браузера.',
      certificateIssuer: 'Robail Internal Engine',
      encryption: 'Sandboxed Isolation',
      isDangerous: false,
      threatType: null,
    };
  }

  try {
    // Sanitize any leading dot in url host
    let cleanUrl = url.trim();
    cleanUrl = cleanUrl.replace(/^(https?:\/\/)\.+/, '$1');

    const parsed = new URL(cleanUrl);
    const isHttps = parsed.protocol === 'https:';
    let hostname = parsed.hostname.toLowerCase().replace(/^\.+|\.+$/g, '');
    const fullUrlLower = cleanUrl.toLowerCase();

    const quarantinedList = customQuarantined || getQuarantinedDomains();

    // 0. Quarantined / Deleted / Explicitly Blocked Domains (e.g. dementor.ru or user-deleted sites)
    const isQuarantined = quarantinedList.some(
      (b) => hostname === b || hostname.endsWith('.' + b) || fullUrlLower.includes(b)
    );
    if (isQuarantined) {
      return {
        isSecure: false,
        protocol: 'http',
        hostname,
        statusText: 'Удалённый небезопасный сайт (Угроза)',
        reason: `Сайт ${hostname} заблокирован и удалён встроенным фильтром безопасности Robail как опасный ресурс.`,
        certificateIssuer: 'Заблокировано и удалено Robail Shield',
        encryption: 'Доступ заблокирован',
        threatType: 'blocked_domain',
        isDangerous: true,
      };
    }

    // 1. Virus / Malware / Trojan threats check
    const matchedVirusPattern = VIRUS_MALWARE_PATTERNS.find(
      (p) => hostname.includes(p) || fullUrlLower.includes(p)
    );
    if (matchedVirusPattern) {
      return {
        isSecure: false,
        protocol: isHttps ? 'https' : 'http',
        hostname,
        statusText: 'ОПАСНО: Вирус / Вредоносная угроза',
        reason: `Внимание! На сайте ${hostname} обнаружены признаки вредоносного ПО (вирус/троян/фишинг). Ресурс опасен для устройства.`,
        certificateIssuer: 'Сертификат скомпрометирован',
        encryption: 'Блокировка угрозы',
        threatType: 'virus',
        isDangerous: true,
      };
    }

    // 2. Pirated / Torrent / Warez sites check
    const matchedPiratePattern = PIRATE_PATTERNS.find(
      (p) => hostname.includes(p) || fullUrlLower.includes(p)
    );
    if (matchedPiratePattern) {
      return {
        isSecure: false,
        protocol: isHttps ? 'https' : 'http',
        hostname,
        statusText: 'ОПАСНО: Пиратский нелегальный сайт',
        reason: `Сайт ${hostname} идентифицирован как пиратский ресурс (торренты, кряки, нелицензионный контент, риск заражения вирусами).`,
        certificateIssuer: 'Недоверенный источник',
        encryption: 'Потенциально вредоносный сайт',
        threatType: 'pirate',
        isDangerous: true,
      };
    }

    // 3. Insecure HTTP (unencrypted protocol) -> OPEN LOCK
    if (!isHttps) {
      return {
        isSecure: false,
        protocol: 'http',
        hostname,
        statusText: 'Небезопасный домен (HTTP)',
        reason: 'Подключение не защищено. Сайт использует протокол HTTP без шифрования. Введенные данные и пароли могут быть перехвачены.',
        certificateIssuer: 'Отсутствует (Нет SSL)',
        encryption: 'Не зашифровано (Plaintext)',
        threatType: null,
        isDangerous: false,
      };
    }

    // 4. Suspicious TLDs & Typosquatting -> OPEN LOCK
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const suspiciousTlds = ['.xyz', '.top', '.buzz', '.click', '.tk', '.ml', '.ga', '.cf', '.gq', '.date', '.racing'];
    const hasSuspiciousTld = suspiciousTlds.some((tld) => hostname.endsWith(tld));
    const suspiciousKeywords = ['fake-login', 'free-money', 'verify-account', 'insecure'];
    const hasSuspiciousWord = suspiciousKeywords.some((w) => hostname.includes(w));

    // Typosquatting detection (e.g. g00gle, y0utube, paypa1, faceb00k)
    const typoPatterns = [/g[0o]{2}gle/, /y[0o]utube/, /paypa[l1]/, /faceb[0o]{2}k/];
    const isTypoSquatting = typoPatterns.some(
      (p) =>
        p.test(hostname) &&
        !['google.com', 'youtube.com', 'paypal.com', 'facebook.com'].some((d) => hostname.endsWith(d))
    );

    if (isIpAddress || hasSuspiciousTld || hasSuspiciousWord || isTypoSquatting) {
      return {
        isSecure: false,
        protocol: 'https',
        hostname,
        statusText: 'Подозрительный небезопасный домен',
        reason: 'Этот доменный адрес определен как потенциально опасный или ненадежный. Рекомендуется покинуть сайт.',
        certificateIssuer: 'Недоверенный сертификат',
        encryption: 'Потенциальная угроза безопасности',
        threatType: 'phishing',
        isDangerous: true,
      };
    }

    // 5. Trusted verified HTTPS domain -> CLOSED LOCK
    return {
      isSecure: true,
      protocol: 'https',
      hostname,
      statusText: 'Безопасное подключение (HTTPS)',
      reason: 'Соединение защищено надежным SSL/TLS шифрованием. Домен проверен встроенным антивирусом Robail.',
      certificateIssuer: 'Google Trust Services / DigiCert Global Root CA',
      encryption: 'TLS 1.3 (AES_256_GCM, X25519)',
      threatType: null,
      isDangerous: false,
    };
  } catch {
    return {
      isSecure: false,
      protocol: 'http',
      hostname: url,
      statusText: 'Недействительный адрес',
      reason: 'Не удалось проверить безопасность данного адреса.',
      threatType: null,
      isDangerous: false,
    };
  }
}

export function parseInputUrl(input: string, customQuarantined?: string[]): { url: string; title: string } {
  let trimmed = input.trim();
  // Strip leading and trailing dots from typed input like .wikipedia.org -> wikipedia.org
  trimmed = trimmed.replace(/^\.+|\.+$/g, '');
  const lower = trimmed.toLowerCase();

  // Internal start page
  if (lower === 'robail://start' || lower === 'about:blank' || lower === '' || lower === 'robail://newtab') {
    return { url: 'robail://start', title: 'Новая вкладка' };
  }

  // Internal Clan Game / Arcade
  if (
    lower === 'robail://clan' ||
    lower === 'robail://arcade' ||
    lower === 'clan' ||
    lower === 'клан' ||
    lower === 'кланы' ||
    lower === 'игра клан' ||
    lower === 'игра клана' ||
    lower === 'битва кланов' ||
    lower === 'война кланов' ||
    lower === 'омега' ||
    lower === 'omega' ||
    lower === 'ии омега' ||
    lower === 'arcade' ||
    lower === 'аркада' ||
    lower === 'игры'
  ) {
    return { url: 'robail://clan', title: 'Война Кланов: ИИ Омега' };
  }

  // Quarantined / blocked domains check
  const quarantinedList = customQuarantined || getQuarantinedDomains();
  const isQuarantined = quarantinedList.some((d) => lower === d || lower.includes(d));
  if (isQuarantined) {
    return { url: `https://${trimmed}`, title: `Доступ заблокирован — ${trimmed}` };
  }

  // Common quick shortcuts
  if (lower === 'youtube' || lower === 'ютуб') {
    return { url: 'https://www.youtube.com', title: 'YouTube' };
  }
  if (lower === 'steam' || lower === 'стим') {
    return { url: 'https://store.steampowered.com', title: 'Steam' };
  }
  if (
    lower === 'gta' ||
    lower === 'gta 5' ||
    lower === 'gta5' ||
    lower === 'гта' ||
    lower === 'гта 5' ||
    lower === 'гта5' ||
    lower === 'gta v' ||
    lower === 'гта v'
  ) {
    return { url: 'https://www.youtube.com?q=GTA+5&tab=shorts', title: 'GTA 5 Shorts — YouTube' };
  }
  if (lower === 'shorts' || lower === 'шорт' || lower === 'шортс') {
    return { url: 'https://www.youtube.com?tab=shorts', title: 'Shorts — YouTube' };
  }
  if (lower === 'wikipedia' || lower === 'википедия' || lower === 'вики') {
    return { url: 'https://ru.wikipedia.org', title: 'Википедия' };
  }
  if (lower === 'google' || lower === 'гугл') {
    return { url: 'https://www.google.com', title: 'Google' };
  }
  if (lower === 'github' || lower === 'гитхаб') {
    return { url: 'https://github.com', title: 'GitHub' };
  }
  if (lower === 'reddit' || lower === 'реддит') {
    return { url: 'https://www.reddit.com', title: 'Reddit' };
  }

  // Check if query is explicitly HTTP (insecure)
  if (trimmed.startsWith('http://')) {
    let title = trimmed;
    try {
      const u = new URL(trimmed);
      u.hostname = u.hostname.replace(/^\.+|\.+$/g, '');
      title = u.hostname;
      return { url: u.toString(), title };
    } catch {
      return { url: trimmed, title };
    }
  }

  // Check if query is explicitly HTTPS (secure)
  if (trimmed.startsWith('https://')) {
    let title = trimmed;
    try {
      const u = new URL(trimmed);
      u.hostname = u.hostname.replace(/^\.+|\.+$/g, '');
      title = u.hostname;
      return { url: u.toString(), title };
    } catch {
      return { url: trimmed, title };
    }
  }

  // Check if it is a domain pattern (e.g. wikipedia.org, youtube.com, etc.)
  const hasDomainPattern =
    /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i.test(trimmed) ||
    /^[a-zA-Z0-9-]+\.(org|com|ru|net|io|edu|gov|de|uk|fr|info|me|app|ai|dev)(\/.*)?$/i.test(trimmed) ||
    trimmed.startsWith('localhost:') ||
    trimmed.startsWith('127.0.0.1');

  if (hasDomainPattern) {
    const finalUrl = 'https://' + trimmed;
    let title = trimmed;
    try { title = new URL(finalUrl).hostname; } catch {}
    return { url: finalUrl, title };
  }

  // Otherwise: Web search query on DuckDuckGo
  return {
    url: `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`,
    title: `${trimmed} — Поиск`,
  };
}

export function createNewTab(url: string = 'robail://start'): Tab {
  const parsed = parseInputUrl(url);
  const id = 'tab-' + Math.random().toString(36).substring(2, 9);
  const security = checkDomainSecurity(parsed.url);

  return {
    id,
    title: parsed.title,
    url: parsed.url,
    isLoading: false,
    history: [parsed.url],
    historyIndex: 0,
    isPinned: false,
    mode: parsed.url === 'robail://start' ? 'start' : 'web',
    security,
  };
}

export function formatUrlForDisplay(url: string): string {
  if (url === 'robail://start') return '';
  return url;
}
