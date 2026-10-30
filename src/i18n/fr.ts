/**
 * French copy. Same keys as src/i18n/en.ts (the `Dict` type enforces it).
 * French typography: narrow no-break space (U+202F) before ; : ! ? and inside « ».
 * No em dashes or en dashes in visible text.
 */
import type { Dict } from './en';

export const fr: Dict = {
  meta: {
    title: "Nicolai Drobyshevski | Fait comme il faut. Identité visuelle, sites, applis et bots",
    description: "Nicolai Drobyshevski, design et développement web pour les petites entreprises à {city}, France.",
    ogLocale: "fr_FR",
    ogImageAlt: "Nicolai Drobyshevski : « Fait comme il faut. »",
    legalTitle: "Mentions légales | Nicolai Drobyshevski",
    notFoundTitle: "Page introuvable | Nicolai Drobyshevski"
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
  imprintLine: "Nouveaux projets à partir de {month}",
  nav: {
    work: "Travaux",
    prices: "Tarifs",
    quote: "Demander un devis",
    stampRing: "NICOLAI DROBYSHEVSKI · DESIGN WEB · LILLE ·"
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
      why: "Pourquoi un indépendant",
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
    intro: "Bonjour, moi c’est Nicolai. Je crée des identités visuelles et je développe des sites, des applis et des bots pour les boutiques, les cafés, les artisans et tous ceux qui ont une bonne idée. Vous avez affaire à moi du premier échange à la mise en ligne, et je reste disponible ensuite.",
    based: "Basé à",
    languages: "Langues",
    replies: "Réponse",
    worksWith: "Pour qui",
    worksWithValue: "Boutiques, cafés, artisans, salons et indépendants",
    note: "Je réponds moi-même à mes e-mails."
  },
  why: {
    kicker: "Pourquoi un indépendant",
    title: "Pourquoi une seule personne plutôt qu’une agence ?",
    p1: {
      pre: "Vous savez toujours qui fait le travail, ",
      mark: "parce que c’est moi.",
      post: " Pas d’intermédiaire qui fait passer les messages, pas de junior qui apprend sur votre projet."
    },
    p2: "Le prix fixé avant que je commence est celui que vous payez. Si quelque chose me prend plus de temps que prévu, c’est mon problème.",
    p3: "Une fois le projet terminé, tout vous appartient : les fichiers de design, le code, le nom de domaine et le compte d’hébergement. Vous pouvez partir quand vous voulez et tout emporter."
  },
  work: {
    kicker: "Travaux",
    title: "Mes réalisations",
    count: "Projets choisis",
    read: "Voir en ligne",
    lookCloser: "Regarder de plus près : {client}, {label}",
    items: [
      {
        kind: "Appli web · Design et code",
        label: "agenda partagé",
        slot: "[Capture de la vue semaine]",
        desc: "Un agenda partagé à deux, synchronisé en direct. Le privé reste privé, et les tâches se glissent dans l’agenda.",
        long: "Un agenda et un gestionnaire de tâches partagés à deux. Le privé reste privé, les événements communs se synchronisent en direct sur les deux téléphones, et les tâches découpées en étapes se glissent directement dans la semaine. Je l’ai conçu et développé de bout en bout, avec connexion par passkey et une appli Android.",
        stack: "Next.js · Supabase Realtime · Passkeys · Android"
      },
      {
        kind: "Plateforme web",
        label: "plateforme d’évaluation des compétences",
        slot: "[Capture d’écran]",
        desc: "Créer des tests de compétences, les noter et lire les résultats.",
        long: "Une plateforme qui mesure les compétences comportementales avec des tests scientifiques. Les équipes créent leurs évaluations à partir d’un référentiel, les candidats les passent dans un lecteur plein écran épuré, et les résultats comparent chaque compétence au niveau attendu pour le poste. En coulisses, des contrôles psychométriques repèrent les questions faibles pour garder des tests fiables.",
        stack: "Next.js · Spring Boot · Clerk · Psychométrie"
      },
      {
        kind: "Appli Android et web",
        label: "sauvegarde pour boîte à rythmes",
        slot: "[Capture d’écran]",
        desc: "Sauvegarde en USB les sons d’une boîte à rythmes.",
        long: "Une appli gratuite pour les possesseurs de la boîte à rythmes EP-133 K.O. II. Elle sauvegarde tous les sons et projets en USB, les restaure, et affiche l’appareil en direct pendant que vous jouez. Elle tourne en appli Android native et dans le navigateur, avec un guide intégré de 100 raccourcis.",
        stack: "Android · Web MIDI · TypeScript · PWA"
      },
      {
        kind: "Bot Telegram · IA",
        label: "bot de traduction Telegram",
        slot: "[Capture d’écran]",
        desc: "Traduit des chaînes Telegram russes en anglais, post par post, avec l’IA.",
        long: "Un bot Telegram qui reproduit des chaînes russes en anglais. Chaque nouveau post est traduit par l’IA et publié en quelques secondes, avec sa mise en forme, ses liens et ses hashtags. Un tableau de bord suit le volume et les erreurs, et permet de modifier le prompt de traduction ou de republier un message à la main.",
        stack: "Python · Telegram API · Claude API · Flask"
      },
      {
        kind: "PWA · appli MCP",
        label: "appli de cartes de français",
        slot: "[Capture d’écran]",
        desc: "Des cartes pour apprendre le français familier, avec répétition espacée.",
        long: "Une appli pensée pour le téléphone, pour apprendre le français familier, de l’argot au verlan. La répétition espacée choisit les mots à revoir chaque jour, les nouveaux mots viennent d’un dictionnaire, de suggestions de l’IA ou d’une capture d’écran de conversation, et une appli MCP permet de réviser et de faire des exercices directement dans une conversation avec Claude.",
        stack: "Next.js PWA · FSRS · Supabase · appli MCP"
      }
    ],
    dialog: {
      prev: "Précédent",
      next: "Suivant",
      close: "Fermer",
      count: "{i} sur {n}",
      shots: "Captures d’écran",
      shotLabel: "Capture {i} : {caption}",
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
      h: "Un prix fixe, par écrit",
      p: "Avec une date de mise en ligne. Si vous dites oui, c’est ce prix-là, point final."
    },
    s3: {
      h: "Je dessine, vous commentez",
      p: "Vous voyez tout le site avant que je le développe, et vous me dites quoi changer."
    },
    s4: {
      h: "Mise en ligne",
      p: "Je le mets en ligne et je vous montre comment le modifier. Ensuite, il suffit d’un e-mail pour me joindre."
    }
  },
  services: {
    kicker: "Services",
    title: "Ce que je peux faire pour vous",
    s1: {
      h: "Un site web",
      p: "Neuf, ou refait à partir du vôtre. Il s’affiche bien sur mobile, ressort sur Google, et vous modifiez vous-même textes et photos."
    },
    s2: {
      h: "Une appli ou un bot",
      pre: "Réservation en ligne, espace client, un bot qui répond chaque jour aux mêmes questions. Si vous le faites à la main chaque semaine, ",
      mark: "ça peut sûrement tourner tout seul.",
      post: ""
    },
    s3: {
      h: "Identité visuelle",
      p: "Un logo, des couleurs et des polices, avec menus, enseignes et publications sociales assortis, pour que tout soit reconnaissable au premier coup d’œil."
    },
    slip: "Vous avez déjà un développeur ? Je peux faire seulement le design. Vous avez déjà un design ? Je le développe."
  },
  prices: {
    kicker: "Tarifs",
    title: "Tarifs",
    sub: "Prix de départ. Le devis gratuit fixe le prix exact.",
    from: "dès",
    pick: "Le choix de la plupart de mes clients.",
    rows: {
      onePage: {
        name: "Site d’une page",
        desc: "Une page sur un modèle prêt, avec vos textes, vos photos et un formulaire."
      },
      business: {
        name: "Site vitrine",
        desc: "3 à 5 pages sur une base éprouvée, avec formulaire, plan et mentions légales."
      },
      app: {
        name: "Appli ou bot",
        desc: "Bots Telegram, réservations, automatisations et outils web pour les tâches répétitives."
      },
      branding: {
        name: "Identité visuelle",
        desc: "Logo avec deux propositions et fichiers SVG et PNG, ou mini charte graphique."
      }
    },
    fine: "Deux séries de modifications incluses. Acompte de 30 % à la commande, solde à la livraison. Tout vous appartient une fois payé.",
    full: "Grille tarifaire complète",
    pto: "T.S.V.P.",
    ptoLabel: "Tournez s’il vous plaît : écrivez-moi"
  },
  contact: {
    kicker: "Contact",
    title: "Écrivez-moi.",
    text: "Parlez-moi de votre activité et de vos besoins. Si un nouveau site n’est pas la solution, je vous le dirai.",
    copy: "Copier",
    copied: "Copié",
    selected: "Sélectionné",
    copiedLive: "Adresse e-mail copiée",
    selectedLive: "Adresse sélectionnée. Appuyez sur Ctrl+C ou Cmd+C pour la copier.",
    note: "Je réponds en général {reply}.",
    call: "Ou réservez un appel de 15 min",
    slipTitle: "Coupon-réponse",
    name: "Nom",
    email: "E-mail",
    needLegend: "Votre besoin",
    needs: {
      newSite: "Un nouveau site",
      fix: "Améliorer mon site actuel",
      app: "Un outil ou une appli sur mesure"
    },
    message: "Message",
    send: "Envoyer",
    sending: "Envoi en cours",
    noteForm: "Arrive directement dans ma boîte mail.",
    noteMailto: "Ouvre votre messagerie. Formulaire pas encore branché.",
    errName: "Merci d’indiquer votre nom.",
    errEmail: "Merci d’indiquer votre adresse e-mail.",
    errEmailBad: "Cette adresse e-mail semble incomplète.",
    errSend: "Un problème est survenu et votre message n’est pas parti. Écrivez-moi plutôt à {email}.",
    mailtoStatus: "Votre messagerie devrait s’ouvrir avec votre message déjà rédigé. Sinon, écrivez à {email}.",
    sentHead: "Envoyé.",
    sentText: "Merci, j’ai bien reçu votre message.",
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
    text: "© {year} Nicolai Drobyshevski. Design et développement web, {city}, France."
  },
  notFound: {
    title: "Page introuvable.",
    text: "Cette page ne fait pas partie du dépliant. La couverture est un bon point de départ.",
    home: "Retour à la couverture",
    other: "English"
  },
  legal: {
    title: "Mentions légales",
    meta: "[Modèle à compléter avant la mise en ligne.]",
    sections: [
      {
        h: "Éditeur du site",
        p: [
          "{publisher}",
          "{siret}",
          "{address}",
          "E-mail : {email}",
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
          "Ce site ne dépose aucun cookie de suivi. Le dépliant enregistre seulement deux préférences dans votre navigateur : l’activation ou non des animations, et le fait que vous ayez déjà vu l’introduction."
        ]
      },
      { h: "Médiation de la consommation", p: ["Les clients particuliers peuvent recourir gratuitement au médiateur de la consommation : CM2C, 49 rue de Ponthieu, 75008 Paris, www.cm2c.net."] }
    ]
  }
};
