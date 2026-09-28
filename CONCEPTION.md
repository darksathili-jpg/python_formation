# Dossier de conception — PYTHON//FORGE

## 1. Contrat de conception

Le produit doit être utilisable par un élève de Première ou Terminale NSI sans créer de compte, sur un navigateur récent, et doit rester un **outil d’apprentissage de l’informatique** plutôt qu’un catalogue de syntaxe Python.

Les arbitrages suivent cinq gates :

1. **Gate Programme** — chaque module porte une correspondance explicite avec un attendu NSI ; les notions non exigibles ne deviennent jamais un prérequis caché.
2. **Gate Pédagogie** — une notion nouvelle est expliquée puis manipulée ; les exercices progressent découverte → consolidation → transfert.
3. **Gate Feedback** — le test automatique décrit un comportement attendu ; l’indice ne donne pas immédiatement la solution ; la correction reste volontairement révélée.
4. **Gate UX & accessibilité** — clavier, contraste, responsive, réduction des mouvements, mode projection et impression sont traités comme fonctions, pas comme finitions.
5. **Gate Technique** — site statique, sans backend obligatoire ; worker Python isolé ; timeout et redémarrage en cas de boucle infinie ; CI de syntaxe et d’intégrité avant déploiement.

## 2. Périmètre pédagogique

### Première

Le parcours Python traite : constructions élémentaires, types de base, types construits utiles, traitement de données tabulaires, spécification/tests, fonctions et algorithmes classiques. Le site ne remplace pas les thèmes Web, architecture, systèmes/réseaux ou histoire de l’informatique.

### Terminale

Le parcours traite : récursivité, modularité, programmation objet au niveau attendu, structures abstraites, arbres, graphes, bases relationnelles/SQL, paradigmes et algorithmique avancée (diviser pour régner, programmation dynamique, recherche textuelle). L’héritage et le polymorphisme ne sont pas introduits comme attendus du parcours.

## 3. Architecture pédagogique d’un module

- **Promesse** : objectif formulé en capacité observable.
- **Cours court** : un concept à la fois, vocabulaire stable.
- **Exemple** : code réduit à ce qui sert la notion.
- **Mission ◆** : application directe.
- **Mission ◆◆** : combinaison de deux idées ou cas limite.
- **Mission ◆◆◆** : transfert, raisonnement ou choix algorithmique.
- **Validation** : tests visibles + sortie réelle du programme.
- **Aides** : indices séquentiels ; solution séparée.

Le test réussi n’est jamais présenté comme une preuve générale : les textes de l’interface invitent à expliquer correction, terminaison et cas limites quand cela est pertinent.

## 4. Direction artistique

Le vocabulaire visuel est celui d’un **atelier de calcul / console instrumentée**, non d’un tableau de bord SaaS générique : grandes compositions typographiques, signal graphique de réseau, anneaux de module, monospace technique et accent différencié Première/Terminale. Les animations sont décoratives et automatiquement neutralisées avec `prefers-reduced-motion`.

## 5. Architecture technique

- SPA statique sans framework : réduit dépendances, temps de build et risques de maintenance.
- `content.js` sépare les données pédagogiques de l’interface.
- `app.js` gère le routeur par hash, la progression locale, la recherche et les interactions.
- `python-worker.js` charge Pyodide et exécute Python hors du thread principal.
- Timeout côté interface : un worker bloqué est détruit puis recréé.
- Service worker : cache uniquement les ressources du site ; Pyodide reste géré par le réseau/CDN.
- GitHub Actions : contrôle statique puis déploiement Pages.

## 6. Protocole de validation avant gel

- Syntaxe JavaScript des scripts.
- Unicité des identifiants de modules et exercices.
- Présence de trois niveaux d’exercice par module.
- Contrôle des routes et ancres.
- Épreuve desktop + mobile.
- Épreuve sombre + clair + vidéoprojecteur.
- Navigation au clavier et focus visible.
- `prefers-reduced-motion`.
- Test réel Pyodide : succès, erreur de syntaxe, test faux, boucle infinie/timeout.
- Vérification des solutions de référence contre tous les tests déclarés.
- Vérification des workflows après merge sur `main`.

## 7. Dette volontaire V1

La V1 n’ajoute ni authentification, ni collecte enseignant, ni synchronisation multi-appareils. Ces fonctions exigeraient un contrat de données et de confidentialité distinct. Le choix actuel maximise la robustesse en classe et la possibilité de travailler immédiatement.
