import { goldPack, goldQuestion as q } from './bac-exam-studio-pack-tools.js';

const SOURCE = 'https://eduscol.education.gouv.fr/sites/default/files/document/26-nsij1an1-127703.pdf';
const AUDIT = 'https://www.math93.com/index.php/annales-du-bac/annales-spe-nsi/bac-nsi-2026-ecrit';

export const bacExamStudioPacks = [
  goldPack({
    key: '2026-amerique-du-nord-sujet-1:2', subjectId: '2026-amerique-du-nord-sujet-1', exercise: 2,
    zone: 'Amérique du Nord', session: 'Sujet 1', title: 'Gamerzz — réseaux, routage et files TCP',
    sourceUrl: SOURCE, correctionAuditUrl: AUDIT, estimatedMinutes: 50,
    concepts: ['CIDR','IPv4','RIP','OSPF','TCP','file FIFO','POO'],
    context: [
      'Le réseau de l’entreprise Gamerzz relie plusieurs sous-réseaux par des routeurs. Les liaisons inter-routeurs en /30 n’offrent que deux adresses hôtes utilisables. Pour une liaison 10.42.0.16/30, on attribue les adresses aux routeurs dans l’ordre alphabétique.',
      'RIP choisit un itinéraire minimisant le nombre de routeurs traversés. OSPF choisit un itinéraire de coût total minimal, avec un coût de liaison inversement proportionnel au débit.',
      'Lorsqu’un routeur reçoit des paquets à transmettre, il les place dans une file FIFO. Deux stratégies sont étudiées : drop-tail, qui refuse tout paquet lorsque la file est pleine, et une stratégie aléatoire qui peut commencer à rejeter des paquets entre deux seuils.'
    ]
  }, [
    q('q1','1','Un sous-réseau est en /28. Détermine le nombre maximal d’adresses attribuables à des machines et explique pourquoi deux adresses de la plage ne peuvent pas être attribuées.', 'text',
      'Un préfixe /28 laisse 4 bits pour la partie machine ; il faut retirer l’adresse réseau et l’adresse de diffusion.',
      ['Calculer 2^(32-28)=16 adresses dans le bloc.', 'Retirer l’adresse dont les bits machine valent tous 0 et celle dont ils valent tous 1.', 'Il reste donc 14 adresses hôtes utilisables.'],
      'Un réseau IPv4 /28 contient 16 adresses au total et 14 adresses attribuables à des machines, les deux autres étant l’adresse réseau et l’adresse de diffusion.',
      ['Répondre 16 sans retirer réseau et diffusion.', 'Confondre longueur du préfixe et nombre de bits de la partie machine.'],
      ['4 bits machine identifiés','16 adresses totales','14 adresses hôtes justifiées']),
    q('q2','2','La liaison entre les routeurs C et F est 10.42.0.16/30. Les deux adresses hôtes sont attribuées dans l’ordre alphabétique. Donne les adresses de C et F.', 'text',
      'Un /30 forme un bloc de quatre adresses : réseau, deux hôtes, diffusion.',
      ['Le bloc va de 10.42.0.16 à 10.42.0.19.', '10.42.0.16 est l’adresse réseau et .19 la diffusion.', 'Les hôtes .17 et .18 reviennent respectivement à C puis F.'],
      'C reçoit 10.42.0.17 et F reçoit 10.42.0.18.',
      ['Attribuer .16 à C alors que c’est l’adresse réseau.', 'Attribuer .19 à F alors que c’est l’adresse de diffusion.'],
      ['bloc /30 correctement délimité','adresses réseau/diffusion exclues','C=.17 et F=.18']),
    q('q3','3','La liaison entre C et D est 10.42.0.12/30, toujours avec attribution dans l’ordre alphabétique. Donne les adresses de C et D.', 'text',
      'Le même raisonnement /30 s’applique au bloc commençant à .12.',
      ['Les quatre adresses sont .12, .13, .14, .15.', '.12 est réseau, .15 diffusion.', 'C reçoit .13 et D reçoit .14.'],
      'C : 10.42.0.13 ; D : 10.42.0.14.',
      ['Oublier que la taille d’un bloc /30 est 4.', 'Utiliser une adresse de réseau ou de diffusion.'],
      ['bloc de quatre adresses','deux hôtes identifiés','affectation alphabétique correcte']),
    q('q4','4','Explique comment construire une ligne de table RIP pour atteindre un réseau distant et quel critère permet de départager deux routes concurrentes.', 'text',
      'Une table RIP mémorise une destination, une passerelle et une métrique en nombre de sauts.',
      ['Identifier les routeurs voisins capables d’acheminer vers la destination.', 'Pour chaque possibilité, compter les sauts jusqu’au réseau visé.', 'Conserver une route de métrique minimale et utiliser comme passerelle le prochain routeur.'],
      'RIP retient un prochain saut menant au nombre minimal de routeurs traversés. La ligne indique le réseau cible, la passerelle choisie et ce nombre de sauts.',
      ['Comparer les débits alors que RIP ne les utilise pas.', 'Mettre l’adresse du réseau distant dans la colonne passerelle.'],
      ['métrique en sauts nommée','prochain saut identifié comme passerelle','route minimale retenue']),
    q('q5','5','Pour OSPF, le coût d’une liaison est 10^10/d où d est le débit en bit/s. Calcule les coûts pour 100 Mbit/s et 1 Gbit/s puis indique quelle liaison est préférée, toutes choses égales par ailleurs.', 'text',
      'Il faut convertir les débits en bit/s puis appliquer la formule ; plus le coût est petit, plus la liaison est attractive.',
      ['100 Mbit/s = 10^8 bit/s, donc coût 10^10/10^8 = 100.', '1 Gbit/s = 10^9 bit/s, donc coût 10.', 'OSPF préfère donc la liaison à 1 Gbit/s si le reste du chemin est identique.'],
      'Les coûts valent respectivement 100 et 10. La liaison à 1 Gbit/s est préférée car son coût OSPF est plus faible.',
      ['Comparer directement les débits sans appliquer le coût demandé.', 'Penser qu’OSPF maximise le coût.'],
      ['conversion des unités correcte','coûts 100 et 10','minimum de coût correctement interprété']),
    q('q6','6','Un segment TCP doit traverser un réseau IP. Explique la relation d’encapsulation entre TCP et IP.', 'text',
      'TCP appartient à la couche transport tandis qu’IP assure l’acheminement réseau : le segment TCP devient la charge utile du paquet IP.',
      ['Les données applicatives sont transportées par TCP.', 'Le segment TCP est encapsulé dans un paquet IP.', 'Les routeurs acheminent alors le paquet IP.'],
      'Les données du segment TCP sont contenues dans le paquet IP ; ce n’est pas le paquet IP qui est placé dans le segment TCP.',
      ['Inverser le sens de l’encapsulation.', 'Confondre TCP avec un protocole de routage.'],
      ['TCP identifié comme transport','segment TCP dans paquet IP','rôle d’IP distingué']),
    q('q7','7','Justifie l’emploi d’une file FIFO plutôt que d’une pile pour les paquets reçus par un routeur.', 'text',
      'Une file restitue les éléments dans l’ordre d’arrivée, ce qui correspond au traitement équitable des paquets en attente.',
      ['Dans une file, le premier arrivé est le premier servi.', 'Une pile traiterait d’abord le paquet le plus récent.', 'Avec un flux continu, des paquets anciens pourraient alors attendre inutilement longtemps.'],
      'Une file FIFO respecte l’ordre d’arrivée des paquets. Une pile LIFO favoriserait les nouveaux paquets et pourrait retarder fortement les plus anciens.',
      ['Dire seulement « une file est plus rapide » sans propriété structurelle.', 'Confondre FIFO et LIFO.'],
      ['FIFO définie','ordre d’arrivée relié au traitement','inconvénient de la pile expliqué']),
    q('q8','8','Écris le constructeur d’une classe RouteurDropTail(t_max) possédant une file vide f, une capacité maximale t_max et une taille courante t initialisée à 0. On dispose de cree_file().', 'code',
      'Le constructeur doit créer un état indépendant pour chaque routeur et initialiser les trois attributs nécessaires au contrôle de capacité.',
      ['Affecter à self.f une nouvelle file vide.', 'Mémoriser le paramètre t_max.', 'Initialiser self.t à 0.'],
      "def __init__(self, t_max):\n    self.f = cree_file()\n    self.t_max = t_max\n    self.t = 0",
      ['Oublier self. devant un attribut.', 'Partager une même file entre plusieurs instances.'],
      ['file créée dans le constructeur','t_max mémorisé','t initialisé à 0']),
    q('q9','9','Écris recoit(self, p) pour la stratégie drop-tail : si la taille courante est strictement inférieure à t_max, enfiler p, incrémenter t et renvoyer True ; sinon renvoyer False.', 'code',
      'La décision dépend uniquement de la capacité restante avant l’arrivée du paquet.',
      ['Tester self.t < self.t_max.', 'En cas d’acceptation, appeler enfile(self.f, p) puis incrémenter self.t.', 'Retourner False sans modifier la file lorsque la capacité est atteinte.'],
      "def recoit(self, p):\n    if self.t < self.t_max:\n        enfile(self.f, p)\n        self.t += 1\n        return True\n    return False",
      ['Utiliser <= et accepter un paquet de trop.', 'Incrémenter t même lorsque le paquet est refusé.'],
      ['test strict de capacité','file et taille mises à jour ensemble','booléen cohérent']),
    q('q10','10','Pour une stratégie avec seuils t_min et t_max : accepter toujours si t<t_min ; entre les deux seuils, accepter seulement si tirage_au_sort() renvoie True ; refuser à partir de t_max. Écris le cœur de recoit(self,p).', 'code',
      'Trois zones de taille doivent être distinguées, avec la même mise à jour de file chaque fois qu’un paquet est accepté.',
      ['Traiter d’abord le cas self.t < self.t_min.', 'Traiter ensuite self.t_min <= self.t < self.t_max et consulter le tirage.', 'Dans tous les autres cas, renvoyer False.'],
      "def recoit(self, p):\n    if self.t < self.t_min:\n        enfile(self.f, p); self.t += 1; return True\n    if self.t < self.t_max and self.tirage_au_sort():\n        enfile(self.f, p); self.t += 1; return True\n    return False",
      ['Accepter automatiquement entre les deux seuils.', 'Oublier d’incrémenter t après un paquet accepté.'],
      ['trois zones correctement distinguées','tirage utilisé seulement dans la zone intermédiaire','état modifié seulement à l’acceptation'])
  ], [
    {id:'A',title:'A · Adressage et routage',questions:['q1','q2','q3','q4','q5']},
    {id:'B',title:'B · TCP et files',questions:['q6','q7','q8','q9','q10']}
  ])
];
