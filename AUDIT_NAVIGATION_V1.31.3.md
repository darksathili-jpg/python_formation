# Audit navigation & overlays — PYTHON//FORGE V1.31.3

## Périmètre

Audit déclenché par une capture utilisateur du **Bac Exam Studio** en mode clair : l’ouverture de « Source officielle » faisait apparaître le PDF dans un tiroir latéral difficile à fermer et trop étroit pour être lisible.

## Diagnostic de la capture

### Bloquant — fermeture masquée

Le composant historique `.studio-source-drawer` était positionné en `fixed` avec `z-index:60`, alors que la barre globale `.topbar` utilise `z-index:100`. Le haut du tiroir passait donc sous la barre globale ; la croix de fermeture pouvait devenir invisible ou inaccessible.

### Bloquant — faux dialogue non modal

Le tiroir était déclaré `role="dialog" aria-modal="false"`. Le contenu de l’application derrière restait opérable alors qu’un panneau large le recouvrait. Au clavier, il était donc possible de perdre le contexte visuel et de tabuler vers des contrôles partiellement masqués.

### Majeur — PDF trop étroit

La largeur maximale de 680 px était insuffisante pour un lecteur PDF de navigateur qui réserve lui-même une colonne aux miniatures et une barre d’outils. Le document principal devenait minuscule. Le problème est aggravé par les extensions PDF (par exemple Adobe Acrobat), dont l’interface interne n’est pas contrôlable par le site.

### Majeur — défilements imbriqués

La page, le tiroir et le lecteur PDF disposaient chacun de leur propre défilement. Cette multiplication des zones scrollables rendait difficile de savoir quel élément recevait la molette et où retrouver la commande de fermeture.

### Majeur — navigation secondaire perdue

Les onglets « Vue d’ensemble / Micro-entraînement / Annales / Bac Exam Studio / … » n’étaient pas persistants pendant les longs exercices. Le retour vers une autre partie d’Écrit Bac demandait de remonter une grande partie de la page.

### Majeur — offsets sticky fragiles

Les panneaux du Studio utilisaient un décalage fixe (`top:86px`) alors que la hauteur réelle de la barre globale peut varier selon le zoom, la largeur, le mode vidéoprojecteur ou la taille de police. Ce type de valeur fixe est à l’origine de contrôles masqués.

### Majeur — Audit perf exposé au même défaut

`.studio-audit` partageait la même famille de positionnement que le tiroir PDF (`z-index:60`, `top:1rem`) et pouvait donc lui aussi passer sous la topbar.

## Références ergonomiques retenues

- Le composant natif `<dialog>` ouvert par `showModal()` est privilégié : top layer, fond rendu inerte, gestion du focus et fermeture par Échap sont prises en charge par le navigateur.
- Un bouton de fermeture explicite et visible doit être présent dans le dialogue.
- À la fermeture, le focus revient au contrôle qui a ouvert le dialogue.
- Les contenus sticky ne doivent pas masquer les éléments recevant le focus ; les offsets sont donc calculés à partir de la hauteur réelle de la barre globale.

Références : MDN `<dialog>` / `showModal()`, W3C WAI Dialog Modal Pattern, WCAG 2.4.11 Focus Not Obscured.

## Correctifs V1.31.3

### Source officielle

- interception du bouton historique avant le gestionnaire V1.31 ;
- suppression défensive de tout ancien `.studio-source-drawer` ;
- vrai `<dialog>` natif ;
- viewport jusqu’à `1500 px × 940 px`, limité à l’écran avec `100dvh` ;
- plein écran du document ;
- ouverture dans un onglet en solution de secours ;
- fermeture par bouton, `Échap` et clic sur l’arrière-plan ;
- focus remis sur « Source officielle » à la fermeture ;
- PDF déchargé (`about:blank`) à la fermeture pour libérer les ressources ;
- indication `page-width` / masquage des panneaux demandée au lecteur PDF quand il la respecte ;
- mobile : dialogue plein écran réel ;
- aucune tentative de masquer l’UI d’une extension PDF externe : elle appartient au navigateur et n’est pas contrôlable depuis la page.

### Navigation Écrit Bac

- barre d’onglets sticky sous la topbar ;
- défilement horizontal des onglets sur écrans étroits ;
- hauteur de topbar mesurée avec `ResizeObserver` et exposée en variable CSS `--app-topbar-height` ;
- panneaux sticky du Studio repositionnés sous les deux niveaux de navigation ;
- panneau Audit perf repositionné sous la topbar avec `z-index:120`.

## Garde-fou CI

Le workflow **Navigation UX Gate** vérifie :

- dialogue natif + `showModal()` ;
- fermeture explicite, Échap, backdrop ;
- restitution du focus ;
- neutralisation du vieux drawer ;
- plein écran + sortie onglet ;
- largeur/hauteur du PDF ;
- navigation sticky et responsive ;
- mesure dynamique de la topbar ;
- visibilité du panneau Audit perf ;
- `prefers-reduced-motion` et impression ;
- budgets de poids du patch : JS ≤ 12 KiB, CSS ≤ 10 KiB ;
- présence des nouveaux assets dans `index.html` et le cache hors ligne.

## Validation humaine à effectuer après déploiement

1. Desktop 1600×900, clair : ouvrir la source, vérifier que le bouton Fermer est immédiatement visible.
2. Appuyer sur Échap : retour de focus sur « Source officielle ».
3. Réouvrir puis cliquer dans le backdrop : fermeture.
4. Tester « Plein écran », puis en sortir avec Échap.
5. Tester à 125 % et 150 % de zoom navigateur.
6. Tester à ~900 px puis ~700 px de largeur.
7. Passer en mode vidéoprojecteur et vérifier les offsets sticky.
8. Ouvrir « Audit perf » et vérifier que son en-tête n’est jamais sous la topbar.
9. Parcourir les contrôles au clavier : aucun élément focusé ne doit être entièrement masqué par un header sticky.
10. Sur un navigateur avec extension Adobe Acrobat, vérifier que les messages propres à l’extension n’empêchent pas l’accès aux commandes du Studio situées hors de l’iframe.
