# Eco Bliss Bath V2 — Tests automatisés

Tests automatisés E2E avec **Cypress** pour le projet Eco Bliss Bath, un site e-commerce de produits de beauté éco-responsables.

---

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

---

## Installation du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/TON_USERNAME/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```

### 2. Lancer le backend (API + base de données)

```bash
docker compose up -d
```

> Attendre que les conteneurs soient bien démarrés avant de continuer.

### 3. Lancer le frontend

```bash
cd frontend
npm install
npm start
```

L'application est accessible sur : `http://localhost:4200`

---

## Lancer les tests

Les tests se trouvent dans le dossier `frontend/cypress/e2e/`.

### Ouvrir l'interface Cypress (mode interactif)

```bash
cd frontend
npx cypress open
```

Puis sélectionner un fichier de test dans l'interface.

### Lancer tous les tests en ligne de commande (mode headless)

```bash
cd frontend
npx cypress run
```

---

## Fichiers de tests

| Fichier       | Description                                      |
| ------------- | ------------------------------------------------ |
| `api.cy.js`   | Tests des endpoints de l'API                     |
| `smoke.cy.js` | Smoke tests des fonctionnalités de base          |
| `xss.cy.js`   | Test de la faille XSS dans l'espace commentaires |
| `login.cy.js` | Scénario fonctionnel — Connexion                 |
| `cart.cy.js`  | Scénario fonctionnel — Panier                    |

---

## Générer un rapport de tests

Pour générer un rapport HTML après l'exécution des tests :

### 1. Installer Mochawesome

```bash
cd frontend
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

### 2. Lancer les tests avec le reporter

```bash
npx cypress run --reporter mochawesome
```

### 3. Consulter le rapport

Le rapport est généré dans le dossier `frontend/cypress/reports/`.

---

## Identifiants de test

| Champ        | Valeur          |
| ------------ | --------------- |
| Email        | `test2@test.fr` |
| Mot de passe | `testtest`      |

---

## Stack technique

- **Frontend** : Angular, Node.js
- **Backend** : Symfony (PHP)
- **Base de données** : MariaDB 11.7.2
- **Tests** : Cypress (JavaScript, E2E)
- **Navigateur** : Chrome
