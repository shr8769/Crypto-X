// Constants for crypto-related data

export const POPULAR_CRYPTOS = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'cardano',
  'solana',
  'polkadot',
  'dogecoin',
  'avalanche-2',
] as const;

export const CRYPTO_ICONS: Record<string, string> = {
  bitcoin: '₿',
  ethereum: 'Ξ',
  cardano: '₳',
  solana: '◎',
  polkadot: '●',
  dogecoin: 'Ð',
  ripple: '✕',
  litecoin: 'Ł',
};

export const MARKET_CATEGORIES = [
  'All',
  'Favorites',
  'DeFi',
  'NFT',
  'Gaming',
  'Layer 1',
  'Layer 2',
] as const;

export const CHART_TIMEFRAMES = [
  { label: '1H', value: '1h' },
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '1Y', value: '1y' },
] as const;

export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_REFRESH_INTERVAL = 30000; // 30 seconds