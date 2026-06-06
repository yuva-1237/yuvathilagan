// ──────────────────────────────────────
// Single source of truth for all profile data
// ──────────────────────────────────────

export const PROFILE = {
  name: 'Yuvathilagan',
  shortName: 'Yuvathilagan',
  alias: 'Yuva',
  title: 'AI Engineer & Data Analyst',
  email: 'yuvathilagan@gmail.com',
  phone: '+91 7200576053',

  blogHost: '', // No blog provided
  formspreeId: '', // Set your Formspree Form ID here to enable emails (or configure via VITE_FORMSPREE_ID in .env)
} as const;

export const SOCIAL_LINKS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/yuva-1237',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yuvathilagan-%E2%80%8C-806681308/',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/_y_u_v_a_10_/',
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    href: 'https://in.pinterest.com/ythilagan/',
  },
  {
    id: 'figma',
    label: 'Figma',
    href: 'https://www.figma.com/@yuvathilagan',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/917200576053',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:yuvathilagan@gmail.com',
  },
] as const;

export type SocialLinkId = (typeof SOCIAL_LINKS)[number]['id'];

/** Helper to get a social link by id */
export const getSocialLink = (id: SocialLinkId) =>
  SOCIAL_LINKS.find((link) => link.id === id)!;
