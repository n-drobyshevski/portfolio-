/**
 * Screenshots shown in the project pop-up (the loose-print dialog), per project id, in order.
 * The first shot matches the card image on the leaflet, so the print lifts off without a jump.
 * Full galleries (and the portfolio re-skins in each house/ folder) live in src/assets/projects.
 */
import type { ImageMetadata } from 'astro';
import type { L } from './site';

import plWeek from '../assets/projects/planner/01-week.webp';
import plBoard from '../assets/projects/planner/06-tasks-board.webp';
import plSubtasks from '../assets/projects/planner/08-subtasks-in-order.webp';
import plSharing from '../assets/projects/planner/11-event-sharing.webp';
import plInsights from '../assets/projects/planner/12-insights.webp';
import ssResults from '../assets/projects/skillsoft/01-results-overview.webp';
import ssCards from '../assets/projects/skillsoft/02-results-competency-cards.webp';
import ssPsy from '../assets/projects/skillsoft/05-psychometrics-dashboard.webp';
import ssTest from '../assets/projects/skillsoft/10-candidate-test.webp';
import ssMapper from '../assets/projects/skillsoft/11-skill-mapper.webp';
import arcLive from '../assets/projects/arc/01-live.webp';
import arcBackups from '../assets/projects/arc/03-backups.webp';
import arcDevice from '../assets/projects/arc/06-device.webp';
import arcGuide from '../assets/projects/arc/09-guide.webp';
import arcWhat from '../assets/projects/arc/11-whats-what.webp';
import trDashboard from '../assets/projects/translator/02-dashboard.webp';
import trDetail from '../assets/projects/translator/04-event-detail.webp';
import trManager from '../assets/projects/translator/05-message-manager.webp';
import trLogs from '../assets/projects/translator/10-logs.webp';
import kReview from '../assets/projects/cards/desktop/01-review.webp';
import kAdd from '../assets/projects/cards/desktop/02-add-suggestions.webp';
import kWord from '../assets/projects/cards/desktop/03-word-detail.webp';
import kProgress from '../assets/projects/cards/desktop/06-progress.webp';
import kChatCards from '../assets/projects/cards/desktop/07-chat-cards.webp';
import kChatExercise from '../assets/projects/cards/desktop/08-chat-exercise.webp';

export interface Shot {
  /** An imported image (resized at build time) or a path in public/ used as is. */
  src: ImageMetadata | string;
  /** 'contain' for phone and chat shots, so they sit whole on the print instead of being cropped. */
  fit?: 'contain';
  caption: L;
}

const N = ' ';

export const galleries: Record<string, Shot[]> = {
  planner: [
    { src: plWeek, caption: { en: 'Week view with both calendars', fr: 'Vue semaine avec les deux agendas' } },
    { src: plBoard, caption: { en: 'Tasks board', fr: 'Tableau des tâches' } },
    { src: plSubtasks, caption: { en: 'Subtasks done in order', fr: 'Sous-tâches à faire dans l’ordre' } },
    { src: plSharing, caption: { en: 'Private, visible or shared events', fr: 'Événements privés, visibles ou partagés' } },
    { src: plInsights, caption: { en: "Where the week's time went", fr: 'Où est passé le temps de la semaine' } },
  ],
  skillsoft: [
    { src: ssResults, caption: { en: 'Candidate results against the benchmark', fr: 'Résultats du candidat face au niveau attendu' } },
    { src: ssCards, caption: { en: 'Competency cards and radar', fr: 'Fiches de compétences et radar' } },
    { src: ssPsy, caption: { en: 'Psychometric health of the tests', fr: 'Santé psychométrique des tests' } },
    { src: ssTest, caption: { en: 'Full-screen test player', fr: 'Lecteur de test plein écran' } },
    { src: ssMapper, caption: { en: 'Skill search across ESCO and O*NET', fr: 'Recherche de compétences ESCO et O*NET' } },
  ],
  arc: [
    { src: arcLive, caption: { en: 'The drum machine, live on screen', fr: 'La boîte à rythmes en direct à l’écran' } },
    { src: arcBackups, caption: { en: 'Library of backups', fr: 'Bibliothèque de sauvegardes' } },
    { src: arcDevice, caption: { en: 'Sounds and projects on the device', fr: 'Sons et projets sur l’appareil' } },
    { src: arcGuide, caption: { en: 'Guide to 100 key combos', fr: 'Guide de 100 raccourcis' } },
    { src: arcWhat, caption: { en: 'Every control labelled', fr: 'Chaque commande expliquée' } },
  ],
  translator: [
    { src: '/work/translator.svg', caption: { en: 'How a post gets translated', fr: 'Comment un post est traduit' } },
    { src: trDashboard, caption: { en: 'Dashboard: volume, timing, latency', fr: `Tableau de bord${N}: volume, horaires, latence` } },
    { src: trDetail, caption: { en: 'Source and translation side by side', fr: 'Original et traduction côte à côte' } },
    { src: trManager, caption: { en: 'Re-post a message by hand', fr: 'Republier un message à la main' } },
    { src: trLogs, caption: { en: 'Live log with retries', fr: 'Journal en direct avec relances' } },
  ],
  cards: [
    { src: kReview, caption: { en: 'Review card with grading', fr: 'Carte de révision et notation' } },
    { src: kAdd, caption: { en: 'Quick add with suggestions', fr: 'Ajout rapide avec suggestions' } },
    { src: kWord, caption: { en: 'Conjugation of a verb', fr: 'La conjugaison d’un verbe' } },
    { src: kProgress, caption: { en: 'Progress and study calendar', fr: 'Progrès et calendrier d’étude' } },
    { src: kChatCards, caption: { en: 'Cards inside a chat with Claude', fr: 'Les cartes dans une conversation avec Claude' } },
    { src: kChatExercise, caption: { en: 'An exercise inside the chat', fr: 'Un exercice dans la conversation' } },
  ],
};
