# Chasse aux Gemmes

Un jeu de puzzle HTML5 en vue isométrique.
On ramasse toutes les gemmes d'un niveau, puis on rejoint la sortie, en poussant rochers et caisses au bon endroit.

**Jouer :** https://guillaumejay.github.io/chasse-aux-gemmes/

Jeu original, dans la tradition des jeux de réflexion « à pousser » : nom, niveaux et graphismes sont propres à ce projet.

## Règles

Le personnage avance d'une case à la fois. Rien ne presse : tout se joue au tour par tour, et chaque coup peut être annulé.

| Élément | Règle |
|---|---|
| Gemmes et sortie | La sortie s'illumine quand toutes les gemmes sont ramassées. |
| Rocher | Poussé dans la lave, il la comble. Dans l'eau, il coule. |
| Caisse | Poussée dans l'eau, elle flotte et fait un pont. Dans la lave, elle brûle. |
| Statues | Elles tirent des flèches en ligne droite. Un rocher ou une caisse sur la ligne protège ce qui est derrière. |
| Clés et portes | Une clé ouvre une porte de sa couleur (rouge ou bleue), une seule fois. |
| Plaques et grilles | La grille reste ouverte tant que quelque chose pèse sur la plaque. |
| Glace | On glisse jusqu'au premier obstacle. Les objets poussés aussi. |
| Téléporteurs | On ressort sur le jumeau, objets compris, sauf s'il est occupé. |
| Dalles fragiles | Elles s'effondrent quand on les quitte. |

## Commandes

| Action | Clavier | Tactile |
|---|---|---|
| Se déplacer | Flèches ou ZQSD (← ↖, ↑ ↗, → ↘, ↓ ↙) | Glisser le doigt en diagonale, ou les quatre boutons |
| Annuler un coup | Retour arrière ou U | Bouton Annuler |
| Recommencer | R | Bouton Recommencer |
| Menu | Échap | Bouton Menu |

## Niveaux

37 niveaux, rangés dans le menu selon leur nombre minimal de coups. On peut passer d'un niveau à l'autre sans les finir.

| Catégorie | Critère | Niveaux |
|---|---|---|
| Tutoriel | une règle expliquée par niveau | 11 |
| Simples | moins de 30 coups | 15 |
| Moyens | de 30 à 60 coups | 9 |
| Difficiles | plus de 60 coups | 2 |

## Développement

Aucune dépendance, aucun build : trois fichiers.

| Fichier | Rôle |
|---|---|
| `index.html` | Affichage (canvas), commandes, menu |
| `logic.js` | Règles du jeu, niveaux, solveur |
| `test.js` | Vérifie les règles et que chaque niveau est résoluble au nombre de coups annoncé |

```bash
node test.js
```

Les niveaux sont décrits en texte dans `logic.js` (légende en tête de fichier). Le solveur explore tous les coups possibles : un niveau n'entre dans le jeu que s'il trouve une solution, et le nombre de coups affiché est le minimum qu'il a trouvé. Cinq labyrinthes (glace, dalles fragiles) ont été choisis par recherche automatique parmi des milliers de tirages aléatoires ; les autres niveaux sont faits main.

Le site est servi par GitHub Pages depuis la branche `main`.

## Comment ce jeu a été fait

Tout le code a été écrit par **Claude Fable 5.2** (`claude-fable-5-2`), le modèle d'Anthropic, piloté dans Claude Code. Aucune ligne n'a été écrite à la main : le jeu est le résultat d'une conversation.

Chiffres relevés dans le journal de la session Claude Code, au moment d'écrire ce README (la rédaction du README elle-même n'est pas comptée dans le temps ni dans les tokens) :

| Mesure | Valeur |
|---|---|
| Prompts donnés | 14 (dont celui qui demande ce README) |
| Temps de travail du modèle | environ 40 minutes |
| Tokens générés (sortie) | 147 881 |
| Tokens lus depuis le cache | 5 515 860 |
| Tokens écrits dans le cache | 194 458 |
| Tokens d'entrée hors cache | 96 |
| Durée de la session principale | 1 h 18, le 22 novembre 2026 |

Comment lire ces chiffres :

- **Temps de travail** : c'est le temps écoulé entre chaque prompt et la fin de la réponse, additionné. Il comprend la réflexion, l'écriture du code et l'exécution des commandes, dont environ 10 minutes de recherche automatique de labyrinthes.
- **Tokens de sortie** : tout ce que le modèle a produit, réflexion, code et réponses confondus.
- **Tokens de cache** : la conversation est relue à chaque étape ; le cache évite de la refacturer au prix fort, d'où un nombre élevé qui ne reflète pas un volume de texte nouveau.

Les 14 prompts, dans l'ordre :

| # | Demande | Temps de travail |
|---|---|---|
| 1 | Faire un jeu de puzzle en HTML5 | 2,2 min |
| 2 | Vue isométrique, personnage plus humain | 1,7 min |
| 3 | Correction : le personnage ne glisse pas, il marche et pousse | 4,5 min |
| 4 | Murs moins épais, personnage redessiné | 1,0 min |
| 5 | Flèches, décor plus naturel, difficulté plus grande | 4,9 min |
| 6 | Quels autres éléments ajouter ? | 0,2 min |
| 7 | Clés, plaques, glace, téléporteurs, dalles fragiles | 5,0 min |
| 8 | Laisser passer les niveaux sans les finir (envoyé pendant le n° 7) | compté avec le n° 7 |
| 9 | Menu de démarrage par difficulté | 2,6 min |
| 10 | Plus de niveaux avec les nouveaux éléments | 14,2 min |
| 11 | Changer le pull, publier sur GitHub Pages (envoyé pendant le n° 10) | compté avec le n° 10 |
| 12 | Murs végétaux | 1,0 min |
| 13 | Commit et push | 2,8 min |
| 14 | Ce README | non compté |
