/**
 * Full price list (from Tarifs-EI.pdf, valid from 1 November 2026).
 * Amounts are starting prices in euros, VAT not applicable (art. 293 B du CGI).
 */
import type { L } from './site';

export interface PriceItem {
  name: L;
  included: L;
  /** Lead time, when the price list gives one. */
  lead?: L;
  /** Starting amount in euros, or a percentage label. */
  amount: number | string;
  /** Price unit shown after the amount, e.g. per month. */
  unit?: L;
  /** True when the amount is a starting price ("from"). */
  from?: boolean;
}

export interface PriceGroup {
  id: string;
  title: L;
  /** Shorter title for the section bar, when the title is long. */
  nav?: L;
  /** Whether the group's items give a lead time. */
  lead?: boolean;
  items: PriceItem[];
  note?: L;
}

const month: L = { en: 'a month', fr: 'par mois' };

export const validFrom: L = { en: 'Valid from 1 November 2026', fr: 'Valables dès le 1er novembre 2026' };

export const priceGroups: PriceGroup[] = [
  {
    id: 'websites',
    title: { en: 'Websites', fr: 'Sites internet' },
    lead: true,
    items: [
      { name: { en: 'Express site', fr: 'Site express' }, included: { en: 'One page on a ready-made template, with your text and photos, form, 1 revision round', fr: 'Une page sur un modèle prêt, avec vos textes et photos, formulaire, 1 série de modifications' }, lead: { en: '3 days', fr: '3 jours' }, amount: 280, from: true },
      { name: { en: 'Landing page', fr: 'Landing page' }, included: { en: 'One page, mobile friendly, contact form, basic SEO', fr: 'Une page, adaptée au mobile, formulaire de contact, référencement de base' }, lead: { en: '1 week', fr: '1 sem.' }, amount: 350, from: true },
      { name: { en: 'Showcase website', fr: 'Site vitrine essentiel' }, included: { en: '3 to 5 pages on a proven base, form, map, legal notice', fr: '3 à 5 pages sur une base éprouvée, formulaire, carte, mentions légales' }, lead: { en: '2 weeks', fr: '2 sem.' }, amount: 660, from: true },
      { name: { en: 'Custom website', fr: 'Site vitrine sur mesure' }, included: { en: 'Design made for you, 5 to 8 pages, animations, basic SEO', fr: 'Design créé pour vous, 5 à 8 pages, animations, référencement de base' }, lead: { en: '3 to 5 weeks', fr: '3 à 5 sem.' }, amount: 1320, from: true },
      { name: { en: 'Small online shop', fr: 'Petite boutique en ligne' }, included: { en: 'Up to 20 products on Shopify or WooCommerce, online payment, subscriptions paid by the client', fr: 'Jusqu’à 20 produits sur Shopify ou WooCommerce, paiement en ligne, abonnements à la charge du client' }, lead: { en: '3 to 4 weeks', fr: '3 à 4 sem.' }, amount: 990, from: true },
      { name: { en: 'Website launch', fr: 'Mise en ligne d’un site' }, included: { en: 'Domain, hosting and launch for a site built elsewhere', fr: 'Nom de domaine, hébergement et mise en ligne pour un site déjà réalisé ailleurs' }, lead: { en: '2 to 3 days', fr: '2 à 3 jours' }, amount: 100, from: true },
      { name: { en: 'Website redesign', fr: 'Refonte de site' }, included: { en: 'New design and structure for an existing site', fr: 'Nouveau design et nouvelle structure pour un site existant' }, lead: { en: '2 to 4 weeks', fr: '2 à 4 sem.' }, amount: 600, from: true },
    ],
  },
  {
    id: 'addons',
    title: { en: 'Add ons', fr: 'Options' },
    items: [
      { name: { en: 'Extra page', fr: 'Page supplémentaire' }, included: { en: 'per page', fr: 'par page' }, amount: 80, from: true },
      { name: { en: 'Second language version', fr: 'Version dans une deuxième langue' }, included: { en: 'of the site price', fr: 'du prix du site' }, amount: '+25 %' },
      { name: { en: 'Online booking', fr: 'Réservation en ligne' }, included: { en: 'through an existing service', fr: 'via un service existant' }, amount: 120, from: true },
      { name: { en: 'Blog or news', fr: 'Blog ou actualités' }, included: { en: 'with admin area', fr: 'avec espace d’administration' }, amount: 150, from: true },
    ],
  },
  {
    id: 'design',
    title: { en: 'Design', fr: 'Design' },
    items: [
      { name: { en: 'Logo', fr: 'Logo' }, included: { en: '2 proposals, 2 revision rounds, SVG and PNG files', fr: '2 propositions, 2 séries de modifications, fichiers SVG et PNG' }, amount: 150, from: true },
      { name: { en: 'Mini brand guide', fr: 'Mini charte graphique' }, included: { en: 'Logo, colours, typefaces, one page of rules', fr: 'Logo, couleurs, typographies, une page de règles' }, amount: 300, from: true },
      { name: { en: 'One page mockup', fr: 'Maquette d’une page' }, included: { en: 'Desktop and mobile version, in Figma', fr: 'Version ordinateur et mobile, dans Figma' }, amount: 150, from: true },
      { name: { en: 'Website mockups', fr: 'Maquettes d’un site' }, included: { en: '3 to 5 pages in Figma, without build', fr: '3 à 5 pages dans Figma, sans intégration' }, amount: 350, from: true },
      { name: { en: 'Social media visuals', fr: 'Visuels réseaux sociaux' }, included: { en: 'Set of 5 post templates', fr: 'Lot de 5 modèles de publications' }, amount: 120, from: true },
    ],
  },
  {
    id: 'bots',
    title: { en: 'Bots and automation', fr: 'Bots et automatisation' },
    nav: { en: 'Bots', fr: 'Bots' },
    items: [
      { name: { en: 'Simple Telegram bot', fr: 'Bot Telegram simple' }, included: { en: 'Menu, answers to common questions, notifications', fr: 'Menu, réponses aux questions fréquentes, notifications' }, amount: 240, from: true },
      { name: { en: 'Advanced Telegram bot', fr: 'Bot Telegram avancé' }, included: { en: 'Bookings or orders, database, admin area', fr: 'Prise de rendez-vous ou de commandes, base de données, espace d’administration' }, amount: 500, from: true },
      { name: { en: 'Bot with payments or AI', fr: 'Bot avec paiement ou IA' }, included: { en: 'In-bot payments or AI-powered answers', fr: 'Paiement dans le bot ou réponses par intelligence artificielle' }, amount: 880, from: true },
      { name: { en: 'AI chatbot for websites', fr: 'Chatbot IA pour site web' }, included: { en: 'Assistant answering your customers from your own content, API costs paid by the client', fr: 'Assistant qui répond à vos clients à partir de vos propres contenus, coûts d’API à la charge du client' }, amount: 440, from: true },
      { name: { en: 'Automation script', fr: 'Script d’automatisation' }, included: { en: 'One task, for example export, data transfer, scheduled report', fr: 'Une tâche, par exemple export, transfert de données, rapport planifié' }, amount: 150, from: true },
      { name: { en: 'API integration', fr: 'Intégration d’API' }, included: { en: 'Connecting 2 to 3 services, for example form, spreadsheet, Telegram', fr: 'Connexion de 2 à 3 services, par exemple formulaire, tableur, Telegram' }, amount: 300, from: true },
      { name: { en: 'Dashboard or internal tool', fr: 'Tableau de bord ou outil interne' }, included: { en: 'Simple web app tailored to your needs', fr: 'Application web simple adaptée à votre besoin' }, amount: 1200, from: true },
    ],
    note: { en: 'Server, domain name and paid third party services (for example AI APIs) are paid by the client.', fr: 'Serveur, nom de domaine et services payants tiers (par exemple API d’intelligence artificielle) à la charge du client.' },
  },
  {
    id: 'maintenance',
    title: { en: 'Maintenance', fr: 'Maintenance' },
    items: [
      { name: { en: 'Essential maintenance', fr: 'Maintenance essentielle' }, included: { en: 'Security updates, backups, monitoring', fr: 'Mises à jour de sécurité, sauvegardes, surveillance' }, amount: 32, unit: month, from: true },
      { name: { en: 'Maintenance plus', fr: 'Maintenance plus' }, included: { en: 'Essential plan plus up to 1 hour of changes a month', fr: 'La formule essentielle et jusqu’à 1 heure de modifications par mois' }, amount: 54, unit: month, from: true },
      { name: { en: 'Bot care', fr: 'Suivi de bot' }, included: { en: 'Monitoring, updates, small fixes', fr: 'Surveillance, mises à jour, petites corrections' }, amount: 28, unit: month, from: true },
    ],
    note: { en: 'No commitment, can be cancelled at any time, effective at the end of the month.', fr: 'Sans engagement, résiliable à tout moment avec effet à la fin du mois.' },
  },
  {
    id: 'rates',
    title: { en: 'Rates', fr: 'Taux' },
    items: [
      { name: { en: 'Hourly rate', fr: 'Heure de travail' }, included: { en: '', fr: '' }, amount: 35 },
      { name: { en: 'Daily rate', fr: 'Journée de travail' }, included: { en: '', fr: '' }, amount: 250 },
    ],
  },
];

export const terms: L<string[]> = {
  en: [
    'Free quote, valid for 30 days.',
    '30% deposit on order, balance on delivery.',
    '2 revision rounds included, 1 for the Express site.',
    'Rights transferred after full payment.',
    'Domain and hosting in the client’s name.',
    'Payment by bank transfer.',
  ],
  fr: [
    'Devis gratuit, valable 30 jours.',
    'Acompte de 30 % à la commande, solde à la livraison.',
    '2 séries de modifications incluses, 1 pour le Site express.',
    'Cession des droits après paiement complet.',
    'Nom de domaine et hébergement au nom du client.',
    'Paiement par virement bancaire.',
  ],
};

export const mediator: L = {
  en: 'Consumer mediator for private clients: CM2C, 49 rue de Ponthieu, 75008 Paris, www.cm2c.net.',
  fr: 'Médiateur de la consommation pour les clients particuliers : CM2C, 49 rue de Ponthieu, 75008 Paris, www.cm2c.net.',
};
