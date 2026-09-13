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
    networks: ['Facebook', 'Instagram', 'Instagram Standalone'],
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
    networks: ['Facebook', 'Instagram', 'Instagram Standalone', 'LinkedIn', 'LinkedIn Page'],
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
    networks: ['Facebook', 'Instagram', 'Instagram Standalone', 'LinkedIn', 'LinkedIn Page', 'TikTok', 'YouTube'],
  },
};

// PayPal no soporta DOP como moneda de transaccion: Stripe sigue cobrando en
// DOP via `pricing`, PayPal usa esta tabla en USD. month_price refleja los
// 3 planes mensuales ya creados y activos en PayPal (verificado via API
// contra los plan_id reales) — no son un estimado. year_price sigue
// PROVISIONAL: los planes anuales aun no existen en PayPal (Fase 4
// pendiente), asi que estos valores no tienen un plan_id real detras
// todavia y no deben tomarse como precio final.
export const pricingUSD: Record<
  'STANDARD' | 'PRO' | 'ULTIMATE',
  { month_price: number; year_price: number }
> = {
  STANDARD: { month_price: 19, year_price: 199 },
  PRO: { month_price: 60, year_price: 559 },
  ULTIMATE: { month_price: 79, year_price: 799 },
};
