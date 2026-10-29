/**
 * French copy. Same keys as src/i18n/en.ts (the `Dict` type enforces it).
 * French typography: narrow no-break space (U+202F) before ; : ! ? and inside « ».
 * No em dashes or en dashes in visible text.
 */
import type { Dict } from './en';

export const fr: Dict = {
  meta: {
    title: "Nick Drobyshevski | Fait comme il faut. Identité visuelle, sites, applis et bots",
    description: "Nick Drobyshevski, design et développement web pour les petites entreprises à {city}, France.",
    ogLocale: "fr_FR",
    ogImageAlt: "Nick Drobyshevski : Fait comme il faut.",
    legalTitle: "Mentions légales | Nick Drobyshevski",
    notFoundTitle: "Page introuvable | Nick Drobyshevski"
  },
  ui: {
    skip: "Passer l’intro",
    language: "Langue",
    shortcuts: "Raccourcis",
    motionLabel: "Animations :",
    motionOn: "oui",
    motionOff: "non",
    motionReduced: "Votre appareil demande moins d’animations, le dépliant reste donc à plat.",
    openLeaflet: "Ouvrir le dépliant",
    open: "Ouvrir",
    scrollHint: "Faites défiler pour ouvrir",
    prevPage: "Page précédente",
    nextPage: "Page suivante",
    home: "Retour à la couverture"
  },
  imprintLine: "Projets possibles dès {month}",
  nav: {
    work: "Travaux",
    prices: "Tarifs",
    quote: "Demander un devis",
    stampRing: "NICK DROBYSHEVSKI · WEB DESIGN · FRANCE ·"
  },
  folio: {
    page: "Page",
    of: "sur 8",
    names: {
      cover: "Couverture",
      hello: "À propos",
      work: "Travaux",
      menu: "Tarifs",
      poster: "Le dépliant ouvert",
      reply: "Contact",
      why: "Pourquoi une personne",
      how: "Comment ça marche",
      services: "Services"
    }
  },
  contents: {
    title: "Sommaire",
    about: "À propos",
    work: "Travaux",
    services: "Services",
    prices: "Tarifs",
    contact: "Contact",
    marks: "Notes au crayon : {state}",
    on: "oui",
    off: "non",
    legal: "Mentions légales"
  },
  cover: {
    h1a: "Fait",
    h1b: "comme il faut",
    place: "Identité visuelle, sites, applis et bots pour les petites entreprises. {city}, France",
    cta: "Parlez-moi de votre projet",
    see: "Voir mes réalisations",
    imprint: "Ne pas jeter sur la voie publique."
  },
  about: {
    kicker: "À propos",
    intro: "Bonjour, moi c’est Nick. Je crée des identités visuelles et je développe des sites, des applis et des bots pour les boutiques, les cafés, les artisans et tous ceux qui ont une bonne idée. Vous avez affaire à moi du premier échange à la mise en ligne, et je suis encore là après.",
    based: "Basé à",
    languages: "Langues",
    replies: "Réponse",
    worksWith: "Pour qui",
    worksWithValue: "Boutiques, cafés, artisans, salons et indépendants",
    note: "Je réponds moi-même à mes e-mails."
  },
  why: {
    kicker: "Pourquoi une personne",
    title: "Pourquoi une seule personne plutôt qu’une agence ?",
    p1: {
      pre: "Vous savez toujours qui fait le travail, ",
      mark: "puisque c’est moi.",
      post: " Pas de chargé de compte qui fait passer les messages, pas de junior qui apprend sur votre projet."
    },
    p2: "Le prix fixé avant que je commence est celui que vous payez. Si quelque chose me prend plus de temps que prévu, c’est mon problème.",
    p3: "Une fois terminé, tout vous appartient : les fichiers de design, le code, le nom de domaine et le compte d’hébergement. Vous pouvez partir quand vous voulez et tout emporter."
  },
  work: {
    kicker: "Travaux",
    title: "Travaux récents",
    count: "3 projets sur {n}",
    read: "Voir comment ça s’est passé",
    lookCloser: "Regarder de plus près",
    items: [
      {
        kind: "Site de restaurant · Design et développement",
        label: "site de restaurant",
        slot: "[Capture du site, idéalement sur un téléphone tenu en main]",
        desc: "[Deux phrases : ce dont ils avaient besoin, et ce que vous avez réalisé pour eux.]"
      },
      {
        kind: "Appli web",
        label: "réservation pour un salon de coiffure",
        slot: "[Capture d’écran]",
        desc: "Réservation en ligne pour un salon de coiffure. [Ce qui a changé pour eux.]"
      },
      {
        kind: "Design",
        label: "portfolio de photographe",
        slot: "[Capture d’écran]",
        desc: "Portfolio pour un photographe. [Ce qui a changé pour lui.]"
      }
    ],
    dialog: {
      prev: "Précédent",
      next: "Suivant",
      close: "Fermer",
      count: "{i} sur {n}",
      caseStudyNote: "L’étude de cas n’est pas encore en ligne sur ce site."
    }
  },
  how: {
    kicker: "Comment ça marche",
    title: "Comment ça marche",
    s1: {
      h: "On en parle",
      pre: "Un appel ",
      mark: "gratuit",
      post: " de 15 minutes. Vous me parlez de votre activité, je vous pose beaucoup de questions."
    },
    s2: {
      h: "Vous recevez un prix fixe",
      p: "Par écrit, avec une date de mise en ligne. Si vous dites oui, c’est ce prix-là, point."
    },
    s3: {
      h: "Je dessine, vous commentez",
      p: "Vous voyez tout le site avant que je le développe, et vous me dites quoi changer."
    },
    s4: {
      h: "Mise en ligne",
      p: "Je le mets en ligne et je vous montre comment le modifier. Ensuite, je suis à un e-mail de vous."
    }
  },
  services: {
    kicker: "Services",
    title: "Ce que je peux faire pour vous",
    s1: {
      h: "Un site web",
      p: "Neuf, ou refait à partir de celui que vous avez. Il marche sur téléphone, apparaît quand on vous cherche, et vous modifiez vous-même les textes et les photos."
    },
    s2: {
      h: "Une appli ou un bot",
      pre: "Réservation en ligne, espace client, un bot qui répond chaque jour aux mêmes questions. Si vous le faites à la main chaque semaine, ",
      mark: "ça peut sûrement tourner tout seul.",
      post: ""
    },
    s3: {
      h: "Identité visuelle",
      p: "Un logo, des couleurs et des typos, plus les menus, enseignes et posts pour les réseaux qui vont avec, pour que tout ait l’air de venir du même endroit."
    },
    slip: "Vous avez déjà un développeur ? Je peux faire seulement le design. Vous avez déjà un design ? Je le développe."
  },
  prices: {
    kicker: "Tarifs",
    title: "Tarifs",
    sub: "Fixés avant de commencer. Je ne facture pas à l’heure.",
    from: "dès",
    pick: "Le choix de la plupart de mes clients.",
    rows: {
      onePage: {
        name: "Site d’une page",
        desc: "Votre activité sur une seule page : ce que vous faites, photos, tarifs, horaires, formulaire de contact et plan."
      },
      business: {
        name: "Site vitrine",
        desc: "Jusqu’à six pages que vous modifiez vous-même, un formulaire de réservation ou de devis, et Google bien réglé pour qu’on vous trouve."
      },
      app: {
        name: "Appli ou bot",
        desc: "Réservations, comptes, paiements, ou un bot pour les tâches répétitives. Prix fixe après un premier appel."
      },
      branding: {
        name: "Identité visuelle",
        desc: "Logo, couleurs et typos, prêts pour l’impression et les écrans."
      }
    },
    fine: "Chaque prix comprend deux séries de modifications, un mois d’aide après la mise en ligne, et tout ce que je crée pour vous vous appartient.",
    pto: "T.S.V.P.",
    ptoLabel: "Tournez s’il vous plaît : écrivez-moi"
  },
  contact: {
    kicker: "Contact",
    title: "Écrivez-moi.",
    text: "Parlez-moi de votre activité et de ce dont vous avez besoin. Si un nouveau site n’est pas la solution, je vous le dirai aussi.",
    copy: "Copier",
    copied: "Copié",
    selected: "Sélectionné",
    copiedLive: "Adresse e-mail copiée",
    selectedLive: "Adresse sélectionnée. Appuyez sur Ctrl+C ou Cmd+C pour la copier.",
    note: "Je réponds moi-même à mes e-mails.",
    call: "Ou réservez un appel de 15 minutes",
    slipTitle: "Coupon-réponse",
    name: "Nom",
    email: "E-mail",
    needLegend: "Votre besoin",
    needs: {
      newSite: "Un nouveau site",
      fix: "Reprendre celui que vous avez",
      app: "Un outil ou une appli sur mesure"
    },
    message: "Message",
    send: "Envoyer",
    sending: "Envoi en cours",
    noteForm: "Arrive directement dans ma boîte mail.",
    noteMailto: "Ouvre votre messagerie. Le formulaire n’est pas encore branché.",
    errName: "Merci d’indiquer votre nom.",
    errEmail: "Merci d’indiquer votre adresse e-mail.",
    errEmailBad: "Cette adresse e-mail semble incomplète.",
    errSend: "Un problème est survenu et votre message n’est pas parti. Écrivez-moi plutôt à {email}.",
    mailtoStatus: "Votre messagerie devrait s’ouvrir avec votre message déjà rédigé. Sinon, écrivez à {email}.",
    sentHead: "Envoyé.",
    sentText: "Je réponds moi-même à mes e-mails.",
    sentReply: "Je réponds en général {reply}.",
    sentLive: "Envoyé. Je vous réponds bientôt.",
    mailSubject: "Nouveau message depuis le site",
    mailNeeds: "Mon besoin",
    months: [
      "JANV",
      "FÉVR",
      "MARS",
      "AVR",
      "MAI",
      "JUIN",
      "JUIL",
      "AOÛT",
      "SEPT",
      "OCT",
      "NOV",
      "DÉC"
    ],
    postmarkRing: "RECEIVED · REÇU · RECEIVED · REÇU ·"
  },
  colophon: {
    text: "© {year} Nick Drobyshevski. Design et développement web, {city}, France."
  },
  notFound: {
    title: "Page introuvable.",
    text: "Cette page ne fait pas partie du dépliant. La couverture est un bon point de départ.",
    home: "Retour à la couverture",
    other: "English"
  },
  legal: {
    title: "Mentions légales",
    meta: "Modèle à compléter avant la mise en ligne.",
    sections: [
      {
        h: "Éditeur du site",
        p: [
          "{publisher}",
          "{siret}",
          "{address}",
          "Courriel : {email}",
          "{phone}"
        ]
      },
      {
        h: "Directeur de la publication",
        p: [
          "{director}"
        ]
      },
      {
        h: "Hébergeur",
        p: [
          "{host}"
        ]
      },
      {
        h: "Propriété intellectuelle",
        p: [
          "Sauf mention contraire, les textes, les images et le code de ce site appartiennent à leur auteur. Toute reproduction sans autorisation écrite est interdite."
        ]
      },
      {
        h: "Données personnelles",
        p: [
          "Si vous utilisez le formulaire de contact, les informations saisies (nom, adresse e-mail, message) servent uniquement à vous répondre. Elles ne sont ni vendues ni transmises. Pour les consulter, les corriger ou les supprimer, écrivez à {email}."
        ]
      },
      {
        h: "Cookies",
        p: [
          "Ce site ne dépose aucun cookie de suivi. Le dépliant garde deux petites préférences dans votre navigateur : animations activées ou non, et si vous avez déjà vu l’introduction."
        ]
      }
    ]
  }
};
