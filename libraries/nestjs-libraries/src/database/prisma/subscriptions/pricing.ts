export interface PricingInnerInterface {
  current: string;
  month_price: number;
  year_price: number;
  channel?: number;
  posts_per_month: number;
  team_members: boolean;
  community_features: boolean;
  featured_by_gitroom: boolean;
  ai: boolean;
  import_from_channels: boolean;
  image_generator?: boolean;
  image_generation_count: number;
  generate_videos: number;
  public_api: boolean;
  webhooks: number;
  autoPost: boolean;
  networks: string[];
}
export interface PricingInterface {
  [key: string]: PricingInnerInterface;
}
export const pricing: PricingInterface = {
  FREE: {
    current: 'FREE',
    month_price: 0,
    year_price: 0,
    channel: 0,
    image_generation_count: 0,
    posts_per_month: 0,
    team_members: false,
    community_features: false,
    featured_by_gitroom: false,
    ai: false,
    import_from_channels: false,
    image_generator: false,
    public_api: false,
    webhooks: 0,
    autoPost: false,
    generate_videos: 0,
    networks: [],
  },
  STANDARD: {
    current: 'STANDARD',
    month_price: 1250,
    year_price: 12000,
    channel: 5,
    posts_per_month: 400,
    image_generation_count: 20,
    team_members: false,
    ai: true,
    community_features: false,
    featured_by_gitroom: false,
    import_from_channels: true,
    image_generator: false,
    public_api: true,
    webhooks: 2,
    autoPost: false,
    generate_videos: 3,
    networks: ['X', 'LinkedIn', 'LinkedIn Page', 'Instagram', 'Instagram Standalone', 'Facebook', 'Threads'],
  },
  TEAM: {
    current: 'TEAM',
    month_price: 2000,
    year_price: 19200,
    channel: 10,
    posts_per_month: 1000000,
    image_generation_count: 100,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10,
    autoPost: true,
    generate_videos: 10,
    networks: ['X', 'LinkedIn', 'LinkedIn Page', 'Instagram', 'Instagram Standalone', 'Facebook', 'Threads', 'YouTube', 'GMB', 'TikTok', 'Pinterest', 'Dribbble'],
  },
  PRO: {
    current: 'PRO',
    month_price: 3500,
    year_price: 33600,
    channel: 30,
    posts_per_month: 1000000,
    image_generation_count: 300,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 30,
    autoPost: true,
    generate_videos: 30,
    networks: ['X', 'LinkedIn', 'LinkedIn Page', 'Instagram', 'Instagram Standalone', 'Facebook', 'Threads', 'YouTube', 'GMB', 'TikTok', 'Pinterest', 'Dribbble', 'Reddit', 'Discord', 'Slack', 'Telegram', 'Medium', 'DevTo', 'Hashnode', 'Wordpress'],
  },
  ULTIMATE: {
    current: 'ULTIMATE',
    month_price: 5000,
    year_price: 48000,
    channel: 100,
    posts_per_month: 1000000,
    image_generation_count: 500,
    community_features: true,
    team_members: true,
    featured_by_gitroom: true,
    ai: true,
    import_from_channels: true,
    image_generator: true,
    public_api: true,
    webhooks: 10000,
    autoPost: true,
    generate_videos: 60,
    networks: ['X', 'LinkedIn', 'LinkedIn Page', 'Instagram', 'Instagram Standalone', 'Facebook', 'Threads', 'YouTube', 'GMB', 'TikTok', 'Pinterest', 'Dribbble', 'Reddit', 'Discord', 'Slack', 'Telegram', 'Medium', 'DevTo', 'Hashnode', 'Wordpress', 'Kick', 'Twitch', 'Mastodon', 'Bluesky', 'Lemmy', 'Farcaster', 'Nostr', 'Vk', 'Listmonk', 'Moltbook', 'Whop', 'Skool', 'Mewe'],
  },
};
