# PYTHON//FORGE — NSI Première & Terminale

Application web statique et interactive de formation à Python pour la spécialité **NSI** au lycée.

## Objectif

Transformer l’apprentissage de Python en parcours actif : **comprendre → prédire → manipuler → tester → expliquer**. Le site distingue deux parcours, Première et Terminale, et limite volontairement le contenu au périmètre où Python sert directement les attendus NSI.

## Contenu de la V1

- 20 modules : 9 en Première, 11 en Terminale ;
- 60 exercices progressifs (3 par module), avec tests automatiques, indices gradués et solutions ;
- exécution Python dans le navigateur via **Pyodide** dans un Web Worker ;
- questions flash, recherche globale, Python Lab ;
- progression locale (`localStorage`) sans compte ni collecte serveur ;
- thèmes sombre/clair, mode vidéoprojecteur, responsive, clavier, `prefers-reduced-motion`, impression ;
- PWA légère : le shell de l’application peut être remis en cache après une première visite ;
- quality gate GitHub Actions et déploiement GitHub Pages.

## Références de programme

Le périmètre a été vérifié à partir des programmes en vigueur :

- Première NSI — BO spécial n°1 du 22 janvier 2019 : <https://www.education.gouv.fr/bo/19/Special1/MENE1901633A.htm>
- Terminale NSI — BO spécial n°8 du 25 juillet 2019 : <https://www.education.gouv.fr/bo/19/Special8/MENE1921247A.htm>
- Éduscol — programmes et ressources NSI : <https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g>

Le manuel *Python 3 — Apprendre à programmer dans l’écosystème Python* (Bob Cordeau, Laurent Pointal, Dunod, 2e éd.) a servi d’appui **méthodologique** : progression, analyse avant codage, exemples, exercices gradués, tests et débogage. Les contenus du site sont reformulés et adaptés à la NSI ; le livre n’est pas reproduit.

## Exécution locale

Le chargement direct en `file://` n’est pas adapté aux modules ES et aux Web Workers. Lancer un serveur local :

```bash
python -m http.server 8000
```

puis ouvrir <http://localhost:8000>.

Le moteur Pyodide est chargé depuis le CDN officiel jsDelivr au premier lancement d’un exercice ou du Python Lab.

## GitHub Pages

Le workflow `.github/workflows/pages.yml` déploie le site à chaque push sur `main`. Dans un dépôt nouvellement créé, GitHub peut demander une activation unique de la source **GitHub Actions** dans **Settings → Pages**.

URL attendue : <https://darksathili-jpg.github.io/python_formation/>

## Architecture

```text
index.html
assets/
  app-shell.js      # vues et état UI
  app.js            # interactions, recherche, exécution
  content*.js       # contenus de cours, exercices, tests, sources
  python-worker.js  # Pyodide isolé du thread UI
  styles.css        # design system, responsive, print, accessibilité
sw.js               # cache du shell local
manifest.webmanifest
.github/workflows/  # quality gate + Pages
```

## Confidentialité

Aucune donnée élève n’est transmise par l’application. La progression est stockée dans le navigateur. Les appels réseau nécessaires au moteur Python servent uniquement à charger Pyodide depuis son CDN.
