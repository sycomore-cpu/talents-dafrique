import React from 'react'
import Link from 'next/link'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { CASES } from '@/lib/constants'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_POSTS = [
  {
    id: '1',
    slug: 'comment-entretenir-ses-locks',
    title: 'Comment entretenir ses locks : le guide complet',
    excerpt:
      'Les locks demandent une attention particulière pour rester belles et saines. De l\'hydratation au twist, découvrez toutes nos astuces pour prendre soin de vos locks au quotidien.',
    cover_image: 'https://picsum.photos/seed/locks/1200/630',
    tags: ['coiffure', 'locks', 'entretien', 'beauté'],
    case_slug: 'beaute',
    author_name: 'Aminata Diallo',
    author_avatar: null as string | null,
    published_at: '2026-03-28T10:00:00Z',
    content_html: `
      <p>Les locks, ou dreadlocks, sont bien plus qu'un style de cheveux : elles représentent une histoire, une identité et un héritage culturel profond. Mais pour qu'elles restent magnifiques et en bonne santé, elles nécessitent un entretien régulier et adapté.</p>

      <h2>Comprendre la structure des locks</h2>
      <p>Avant de parler entretien, il est important de comprendre ce que sont les locks. Ce sont des mèches de cheveux qui ont été entortillées et qui, avec le temps, se sont solidifiées. Le cheveu naturellement crépu africain se prête particulièrement bien à la formation de locks grâce à sa texture.</p>
      <p>Il existe plusieurs types de locks : les locks freeform (qui se forment naturellement sans intervention), les locks twistées (créées à partir de deux mèches entortillées) et les locks sisterlocks (plus fines et uniformes).</p>

      <h2>L'hydratation : la règle d'or</h2>
      <p>Le cheveu en lock a souvent tendance à se dessécher, surtout aux extrémités. L'hydratation est donc votre meilleure alliée. Voici comment procéder :</p>
      <ul>
        <li><strong>Vaporisez de l'eau</strong> sur vos locks régulièrement, idéalement tous les deux à trois jours.</li>
        <li><strong>Appliquez une huile légère</strong> — huile de ricin, huile de jojoba ou huile d'avocat — en insistant sur les pointes.</li>
        <li><strong>Évitez les produits trop lourds</strong> qui peuvent s'accumuler dans les locks et provoquer des résidus difficiles à éliminer.</li>
      </ul>

      <h2>Le lavage des locks</h2>
      <p>Contrairement aux idées reçues, les locks doivent être lavées régulièrement. Un cuir chevelu propre favorise une bonne croissance capillaire et évite les démangeaisons.</p>
      <p>Lavez vos locks avec un shampooing clarifiant une fois par semaine ou toutes les deux semaines selon votre type de cuir chevelu. Massez délicatement le cuir chevelu avec le bout des doigts, puis rincez abondamment. Assurez-vous que vos locks sont parfaitement séchées après le lavage pour éviter la formation de moisissures.</p>

      <h2>Le retightening : retwister les repousses</h2>
      <p>Avec la croissance des cheveux, des repousses apparaissent à la racine des locks. Le retightening consiste à retordre ces nouvelles pousses pour les intégrer à la lock existante. Cette opération est généralement réalisée toutes les quatre à six semaines selon la vitesse de croissance de vos cheveux.</p>
      <p>Vous pouvez effectuer cette manipulation vous-même ou faire appel à un professionnel de la Case Beauté sur Talents d'Afrique. Un mauvais retightening peut fragiliser les locks, donc n'hésitez pas à vous faire accompagner les premières fois.</p>

      <h2>Les produits à bannir</h2>
      <p>Certains produits sont à éviter absolument pour ne pas abîmer vos locks :</p>
      <ul>
        <li>Les cires et beurres épais qui s'accumulent et forment des résidus</li>
        <li>Les shampooings à la silicone qui empêchent l'hydratation</li>
        <li>Les produits contenant des alcools desséchants</li>
      </ul>

      <h2>Faire appel à un talent</h2>
      <p>Si vous êtes débutant ou si vous souhaitez un entretien professionnel, la communauté Talents d'Afrique regorge de coiffeuses spécialisées dans les locks. Elles peuvent vous accompagner pour le retightening, le soin des locks abîmées ou simplement vous donner des conseils personnalisés.</p>
      <p>Consultez la Case Beauté pour trouver un talent près de chez vous.</p>
    `,
  },
  {
    id: '2',
    slug: 'monter-meubles-ikea-paris',
    title: 'Monter ses meubles IKEA : nos talents disponibles ce week-end à Paris',
    excerpt:
      'Vous avez acheté votre nouveau PAX ou votre KALLAX et vous ne savez pas par où commencer ? Nos talents de la Case Maison sont là pour vous aider, disponibles dès ce samedi.',
    cover_image: 'https://picsum.photos/seed/ikea/1200/630',
    tags: ['montage', 'IKEA', 'Paris', 'maison'],
    case_slug: 'maison',
    author_name: 'Oumar Keïta',
    author_avatar: null as string | null,
    published_at: '2026-04-02T09:00:00Z',
    content_html: `
      <p>Chaque week-end, des milliers de personnes en France se retrouvent face à des boîtes plates IKEA, une notice illustrée incompréhensible et une pile de vis de différentes tailles. C'est une situation que nos talents de la Case Maison connaissent bien — et qu'ils savent résoudre avec efficacité.</p>

      <h2>Pourquoi faire appel à un talent pour monter ses meubles ?</h2>
      <p>Monter un meuble IKEA peut sembler simple, mais certains modèles — notamment les grandes armoires PAX ou les bibliothèques BILLY — peuvent prendre plusieurs heures et nécessitent deux personnes. Une mauvaise installation peut aussi abîmer le meuble ou créer des risques de sécurité.</p>
      <p>Nos talents de la Case Maison sont habitués à tous les modèles IKEA. Certains ont même développé des techniques pour assembler un PAX complet en moins d'une heure.</p>

      <h2>Ce qui est inclus dans la prestation</h2>
      <p>Lorsque vous faites appel à un talent de la Case Maison, voici ce que vous pouvez attendre :</p>
      <ul>
        <li>Montage complet des meubles</li>
        <li>Fixation murale sécurisée si nécessaire</li>
        <li>Nettoyage de l'espace de travail en fin de prestation</li>
        <li>Conseils pour l'agencement et l'optimisation de l'espace</li>
      </ul>

      <h2>Disponibilités ce week-end à Paris</h2>
      <p>Plusieurs talents de la Case Maison sont disponibles ce week-end dans différents arrondissements de Paris et en petite couronne. Que vous soyez dans le 13e, à Vincennes ou à Saint-Denis, vous trouverez forcément un talent proche de chez vous.</p>
      <p>N'hésitez pas à envoyer votre demande rapidement — les créneaux du week-end partent vite, surtout en ce moment où beaucoup de personnes déménagent au printemps.</p>

      <h2>Tarifs pratiqués</h2>
      <p>Les tarifs sont librement fixés par chaque talent. En général, comptez entre 20 et 50 euros de l'heure selon la complexité des meubles et les déplacements. Certains proposent des forfaits pour plusieurs meubles. La grille tarifaire est toujours visible sur le profil du talent avant de confirmer votre demande.</p>

      <h2>Conseils pour préparer la prestation</h2>
      <p>Pour que tout se passe au mieux, préparez votre logement avant l'arrivée du talent :</p>
      <ul>
        <li>Déballer les boîtes et vérifier que toutes les pièces sont présentes</li>
        <li>Dégager l'espace où le meuble sera installé</li>
        <li>Indiquer clairement si vous avez besoin d'une fixation murale (prévoir la cheville appropriée)</li>
      </ul>
    `,
  },
  {
    id: '3',
    slug: 'recette-thieboudienne-mme-fatou',
    title: 'Recette du thiéboudienne de Mme Fatou',
    excerpt:
      'Le thiéboudienne, riz au poisson sénégalais, est un plat emblématique de la gastronomie africaine. Mme Fatou, chef de la Case Saveurs à Lyon, partage sa recette familiale.',
    cover_image: 'https://picsum.photos/seed/thieb/1200/630',
    tags: ['recette', 'cuisine africaine', 'sénégal', 'riz au poisson'],
    case_slug: 'saveurs',
    author_name: 'Fatou Kouyaté',
    author_avatar: null as string | null,
    published_at: '2026-04-05T12:00:00Z',
    content_html: `
      <p>Le thiéboudienne — que l'on prononce "tchép bou dien" — est le plat national du Sénégal. Il se compose de riz cuit dans une sauce à base de tomate, accompagné de poisson et de légumes variés. Chaque famille a sa propre recette, transmise de génération en génération. Voici la mienne.</p>

      <h2>Ingrédients (pour 6 personnes)</h2>
      <ul>
        <li>1 kg de riz brisé sénégalais</li>
        <li>1,5 kg de poisson frais (thiof ou mérou de préférence, ou daurade)</li>
        <li>200g de concentré de tomates</li>
        <li>3 tomates fraîches</li>
        <li>2 oignons</li>
        <li>1 chou vert coupé en quartiers</li>
        <li>3 carottes coupées en rondelles épaisses</li>
        <li>1 aubergine coupée en morceaux</li>
        <li>2 navets coupés en quartiers</li>
        <li>Huile d'arachide</li>
        <li>Sel, poivre, piment selon votre goût</li>
        <li>Persil frais, ail, piment vert pour la farce (diaxatu)</li>
      </ul>

      <h2>Préparation du poisson</h2>
      <p>Commencez par préparer la farce (diaxatu) : mélangez du persil haché, de l'ail écrasé, du piment vert et du sel. Faites des incisions dans le poisson et remplissez-les avec cette farce. Laissez mariner 30 minutes.</p>
      <p>Faites frire le poisson dans l'huile d'arachide jusqu'à ce qu'il soit doré, puis réservez.</p>

      <h2>La sauce</h2>
      <p>Dans la même huile, faites revenir les oignons émincés jusqu'à ce qu'ils soient translucides. Ajoutez le concentré de tomates et les tomates fraîches. Laissez cuire à feu moyen pendant 20 à 25 minutes en remuant régulièrement jusqu'à ce que la sauce réduise et prenne une belle couleur rouge foncé.</p>
      <p>C'est cette étape qui demande le plus de patience, mais c'est elle qui donne toute la saveur au plat.</p>

      <h2>Cuisson des légumes et du riz</h2>
      <p>Ajoutez de l'eau bouillante à la sauce (environ 2 litres), puis plongez-y les légumes : chou, carottes, aubergine et navets. Laissez cuire 20 minutes. Ajoutez le poisson frit et laissez cuire encore 10 minutes à feu doux.</p>
      <p>Retirez les légumes et le poisson. Dans le bouillon restant, faites cuire le riz jusqu'à absorption complète du liquide. Le riz doit être légèrement caramélisé au fond de la marmite — c'est le xonn, la partie la plus appréciée !</p>

      <h2>Le dressage</h2>
      <p>Disposez le riz dans un grand plat. Arrangez les légumes et le poisson par-dessus. Servez avec des quartiers de citron et du piment haché pour ceux qui aiment relever le goût.</p>
      <p>Ce plat se partage toujours en famille ou entre amis, idéalement dans un grand plat commun posé au centre de la table.</p>

      <p><em>Si vous souhaitez que je prépare ce plat pour vous ou votre famille, contactez-moi via la Case Saveurs sur Talents d'Afrique. Je propose également des cours de cuisine à domicile.</em></p>
    `,
  },
  {
    id: '4',
    slug: 'kory-inspire-cauri-monnaie-africaine',
    title: 'Pourquoi le Kory s\'inspire du Cauri, l\'ancienne monnaie africaine',
    excerpt:
      "Le Cauri a été utilisé comme moyen d'échange en Afrique pendant des siècles. En créant le Kory, Talents d'Afrique rend hommage à cet héritage tout en construisant une économie communautaire moderne.",
    cover_image: 'https://picsum.photos/seed/cauri/1200/630',
    tags: ['kory', 'cauri', 'économie', 'diaspora', 'histoire'],
    case_slug: null,
    author_name: "L'équipe Talents d'Afrique",
    author_avatar: null as string | null,
    published_at: '2026-04-08T14:00:00Z',
    content_html: `
      <p>Quand nous avons créé Talents d'Afrique, nous voulions que chaque élément de la plateforme reflète notre héritage culturel. Le nom "Kory" — notre monnaie virtuelle communautaire — n'a pas été choisi au hasard. Il s'inspire directement du Cauri, l'une des plus anciennes et des plus répandues monnaies du monde.</p>

      <h2>L'histoire du Cauri</h2>
      <p>Le Cauri (Cypraea moneta) est un petit coquillage blanc qui a servi de moyen d'échange en Afrique, en Asie et dans les îles du Pacifique pendant des millénaires. En Afrique de l'Ouest, il était particulièrement répandu : on s'en servait pour acheter et vendre des biens, mais aussi pour les cérémonies, la dot ou les jeux.</p>
      <p>Ce qui rend le Cauri si particulier, c'est son universalité. Il traversait les frontières, les ethnies et les langues. C'était un symbole de la communauté, accessible à tous, qui favorisait les échanges entre les peuples.</p>

      <h2>Le Kory : un symbole de confiance</h2>
      <p>Le Kory s'inspire de ces valeurs. Ce n'est pas un crédit que l'on achète avec de l'argent réel. On le gagne en participant à la communauté : en s'inscrivant, en parrainant d'autres membres, en étant un talent actif et bien noté.</p>
      <p>Comme le Cauri, le Kory est un symbole de confiance et de réciprocité. Il n'a pas de valeur marchande directe — on ne peut pas le convertir en euros — mais il a une valeur communautaire : il permet aux talents d'accepter des demandes, aux membres de parrainer d'autres membres, et crée un système économique vertueux à l'intérieur de la communauté.</p>

      <h2>Un hommage à nos racines</h2>
      <p>En choisissant ce nom et ce symbole, nous voulions rappeler que nos ancêtres avaient déjà inventé des systèmes économiques sophistiqués bien avant la colonisation. La tontine, le "djassa" (système d'entraide), les marchés communautaires : autant de pratiques qui témoignent d'une intelligence collective et d'une solidarité qui perdurent dans notre communauté.</p>
      <p>Le Kory est donc à la fois un outil pratique et un symbole : celui d'une communauté qui s'entraide, qui valorise ses talents, et qui honore son héritage.</p>

      <h2>Comment obtenir des Korys ?</h2>
      <p>Si vous vous inscrivez sur Talents d'Afrique, vous recevez automatiquement 10 Korys de bienvenue. Chaque parrainage vous rapporte 3 Korys supplémentaires. Les talents qui répondent bien aux demandes et maintiennent un bon niveau de confiance peuvent également bénéficier de bonus communautaires.</p>
    `,
  },
  {
    id: '5',
    slug: 'tresses-domicile-choisir-coiffeuse',
    title: 'Tresses à domicile : comment choisir sa coiffeuse',
    excerpt:
      'Box braids, knotless braids, tresses sénégalaises... Le choix est vaste ! Voici nos conseils pour trouver la coiffeuse qui correspond exactement à ce que vous recherchez.',
    cover_image: 'https://picsum.photos/seed/tresses/1200/630',
    tags: ['tresses', 'coiffure', 'braids', 'beauté', 'domicile'],
    case_slug: 'beaute',
    author_name: 'Mariama Bah',
    author_avatar: null as string | null,
    published_at: '2026-04-09T10:00:00Z',
    content_html: `
      <p>Se faire tresser à domicile présente de nombreux avantages : vous êtes chez vous, dans votre confort, et vous pouvez profiter de la prestation sans vous déplacer. Mais pour que la séance se passe parfaitement, encore faut-il choisir la bonne coiffeuse. Voici nos conseils.</p>

      <h2>Définissez d'abord votre style</h2>
      <p>Avant de rechercher une coiffeuse, définissez précisément ce que vous voulez. Les différents styles de tresses ne se réalisent pas de la même façon et certaines coiffeuses sont spécialisées dans des techniques particulières :</p>
      <ul>
        <li><strong>Box braids</strong> : tresses carrées classiques avec extensions</li>
        <li><strong>Knotless braids</strong> : technique sans nœud à la racine, plus légère et moins douloureuse</li>
        <li><strong>Tresses sénégalaises</strong> : tresses fines et longues, souvent avec rajouts</li>
        <li><strong>Ghana braids / Cornrows</strong> : tresses plaquées sur le crâne</li>
        <li><strong>Faux locks</strong> : imitation de locks avec extensions</li>
      </ul>

      <h2>Regardez les réalisations et les avis</h2>
      <p>Sur Talents d'Afrique, chaque coiffeuse peut partager des photos de ses réalisations dans sa galerie. Prenez le temps de les regarder attentivement. Vérifiez :</p>
      <ul>
        <li>La régularité et la finesse des tresses</li>
        <li>La netteté des lignes de séparation</li>
        <li>La qualité des finitions aux extrémités</li>
        <li>Les commentaires laissés par les clients précédents</li>
      </ul>

      <h2>Posez les bonnes questions</h2>
      <p>Avant de confirmer votre demande, n'hésitez pas à poser des questions dans la description de votre demande :</p>
      <ul>
        <li>Quel type de rajouts utilisez-vous ?</li>
        <li>Quelle est la durée estimée de la prestation ?</li>
        <li>Les rajouts sont-ils inclus dans le tarif ou à ma charge ?</li>
        <li>Avez-vous de l'expérience avec mon type de cheveux ?</li>
      </ul>

      <h2>Préparez vos cheveux</h2>
      <p>Arrivez avec vos cheveux propres, légèrement hydratés et démêlés. Certaines coiffeuses proposent de laver et préparer les cheveux avant la séance, mais cela peut augmenter la durée et le tarif. Renseignez-vous à l'avance.</p>

      <h2>Faire confiance aux talents parrainés</h2>
      <p>Les talents parrainés sur Talents d'Afrique ont été validés par les membres de la communauté. Ils ont reçu des avis positifs et ont été parrainés par des membres de confiance. C'est un gage de sérieux et de qualité qui peut vous aider à faire votre choix.</p>
    `,
  },
  {
    id: '6',
    slug: 'diaspora-camerounaise-lyon-talents',
    title: 'La diaspora camerounaise à Lyon : les talents qui cartonnent',
    excerpt:
      'Lyon abrite une communauté camerounaise dynamique et créative. Rencontre avec cinq talents de la ville qui ont transformé leur passion en activité grâce à Talents d\'Afrique.',
    cover_image: 'https://picsum.photos/seed/lyon/1200/630',
    tags: ['Lyon', 'Cameroun', 'diaspora', 'communauté'],
    case_slug: null,
    author_name: 'Nadia Tchoupo',
    author_avatar: null as string | null,
    published_at: '2026-04-11T11:00:00Z',
    content_html: `
      <p>Lyon est souvent surnommée la "deuxième capitale" de la France, mais pour les membres de la communauté camerounaise, c'est surtout une ville où il fait bon vivre et entreprendre. Avec une communauté dynamique de plusieurs milliers de membres, Lyon regorge de talents qui se sont fait un nom sur Talents d'Afrique.</p>

      <h2>Estelle, reine des perruques sur-mesure</h2>
      <p>Estelle est arrivée à Lyon il y a sept ans avec ses compétences en coiffure acquises à Douala. Aujourd'hui, elle est l'une des talents les mieux notées de la Case Beauté dans toute la région lyonnaise. Sa spécialité : les perruques sur-mesure, qu'elle confectionne elle-même à partir de cheveux naturels.</p>
      <p>"Sur Talents d'Afrique, j'ai trouvé des clientes qui apprécient vraiment mon travail. Ce ne sont pas juste des clientes — ce sont des membres de notre communauté."</p>

      <h2>Théodore, le bricoleur de la communauté</h2>
      <p>Théodore est électricien de formation, mais sur Talents d'Afrique, il propose des services de petit bricolage et de montage de meubles. Ce père de famille de la Case Maison est particulièrement apprécié pour sa ponctualité et son professionnalisme.</p>

      <h2>Clarisse et ses ndolé fameux</h2>
      <p>Le ndolé de Clarisse est légendaire dans le quartier de la Guillotière. Cette cuisinière de talent propose des prestations de chef à domicile et des commandes de plats cuisinés pour les événements familiaux. Elle est aussi disponible pour des cours de cuisine camerounaise.</p>

      <h2>Une communauté qui s'entraide</h2>
      <p>Ce qui frappe quand on parle à ces talents, c'est le sentiment fort d'appartenance à une communauté. Plusieurs d'entre eux se sont entre-parrainés sur la plateforme, obtenant ainsi le badge Certifié par le Cercle qui les rend plus visibles et plus crédibles aux yeux des clients.</p>
      <p>Cette solidarité communautaire est au cœur du projet Talents d'Afrique : créer un espace où notre communauté peut s'entraider, se valoriser et prospérer ensemble.</p>

      <h2>Comment rejoindre la communauté à Lyon ?</h2>
      <p>Si vous êtes talent ou si vous cherchez un service à Lyon, inscrivez-vous sur Talents d'Afrique et explorez les profils de votre ville. La communauté lyonnaise est active et accueillante — il ne vous reste qu'à franchir le pas.</p>
    `,
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>
}

// ─── generateStaticParams ────────────────────────────────────────────────────

export async function generateStaticParams() {
  return MOCK_POSTS.map((post) => ({ slug: post.slug }))
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const post = MOCK_POSTS.find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Article introuvable' }
  }

  const previousImages = (await parent).openGraph?.images ?? []

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image
        ? [post.cover_image, ...previousImages]
        : previousImages,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name],
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function readingTime(html: string): string {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min de lecture`
}

// ─── Share Buttons ────────────────────────────────────────────────────────────

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://talentsdafrique.fr/blog/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-brown/50 font-medium">Partager :</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-black text-white hover:bg-black/80 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X / Twitter
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = MOCK_POSTS.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const caseData = post.case_slug
    ? CASES.find((c) => c.slug === post.case_slug)
    : null

  const relatedPosts = MOCK_POSTS.filter(
    (p) => p.id !== post.id && p.case_slug === post.case_slug
  ).slice(0, 2)

  return (
    <div className="min-h-screen bg-cream">
      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brown/50 mb-6">
          <Link href="/" className="hover:text-brown transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brown transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-brown line-clamp-1">{post.title}</span>
        </nav>

        {/* Cover image */}
        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden aspect-video mb-8 bg-brown/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags + case badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {caseData && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border font-medium ${caseData.color}`}
            >
              {caseData.icon} {caseData.label}
            </span>
          )}
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-brown/5 text-brown/50 border border-brown/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-brown font-playfair leading-tight mb-5">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-brown/10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-base font-bold text-primary shrink-0">
            {post.author_name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-brown">{post.author_name}</p>
            <p className="text-xs text-brown/50">
              {formatDate(post.published_at)} · {readingTime(post.content_html)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-brown max-w-none text-brown leading-relaxed
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-playfair [&_h2]:text-brown [&_h2]:mt-8 [&_h2]:mb-3
            [&_p]:text-brown/80 [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:text-brown/80 [&_ul_li]:mb-1.5
            [&_strong]:text-brown [&_strong]:font-semibold
            [&_em]:text-brown/60 [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />

        {/* Share buttons */}
        <div className="mt-10 pt-6 border-t border-brown/10">
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        {/* Related talents CTA */}
        {caseData && (
          <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-brown text-sm">
                {caseData.icon} {caseData.label}
              </p>
              <p className="text-sm text-brown/60 mt-1">
                Trouvez un talent disponible près de chez vous pour ce service.
              </p>
            </div>
            <Link
              href={`/cases/${caseData.slug}`}
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
            >
              Trouver un talent →
            </Link>
          </div>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-brown font-playfair mb-4">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="bg-white rounded-xl border border-brown/10 p-4 hover:shadow-sm transition-shadow group"
                >
                  <p className="font-medium text-brown text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {related.title}
                  </p>
                  <p className="text-xs text-brown/50 mt-2">
                    {formatDate(related.published_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
