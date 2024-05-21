# 📦 Automatisation de Clôture de Commandes

Ce projet est un script en Node.js conçu pour automatiser la récupération et la clôture des commandes depuis l'API Zelty.

## 📋 Prérequis

- 🖥️ Node.js installé sur votre machine
- 🔑 Un token Bearer valide pour accéder à l'API Zelty
- 📦 Les modules Node.js suivants : `fs`, `https`, `readline`, `path`, `axios`

## 🛠️ Installation

1. Clonez ce dépôt ou téléchargez les fichiers.
2. Assurez-vous d'avoir Node.js installé. Si ce n'est pas le cas, vous pouvez le télécharger [ici](https://nodejs.org/).
3. Installez les dépendances requises avec npm :

```bash
npm install axios
```

## 🚀 Utilisation

1. **Exécutez le script** :
   
   ```bash
   node automatisation_cloture_cmd.js
   ```

2. **Fournissez les informations requises** :
   - **🔑 Token Bearer** : Utilisé pour authentifier les requêtes API.
   - **📂 Chemin du fichier `ids.json`** : Fichier contenant les ID des commandes à traiter.
   - **📂 Chemin du fichier `results.json`** : Fichier où les résultats des transactions seront sauvegardés.

## 🎯 Fonctionnalités

### 📥 Récupération et Sauvegarde des Données des Tickets

Le script commence par récupérer les commandes ouvertes depuis l'API Zelty et les sauvegarde dans un fichier `ticket.json`.

### 📝 Création du Fichier `ids.json`

Il crée ensuite un fichier `ids.json` contenant les IDs des commandes récupérées.

### 🔄 Exécution des Transactions et Clôture des Commandes

Pour chaque commande, le script :
- Effectue une transaction en envoyant une requête POST à l'API.
- Clôture la commande en envoyant une autre requête POST à l'API.
- Sauvegarde les résultats dans un fichier `results.json`.

## 🗂️ Structure du Projet

- `automatisation_cloture_cmd.js` : Script principal contenant toute la logique d'automatisation.

## ⚙️ Détails Techniques

### 🔧 Fonction `fetchAndSaveTicketData`

Cette fonction récupère les commandes ouvertes et les sauvegarde dans un fichier `ticket.json`.

### 🔧 Fonction `createIdsJsonFile`

Cette fonction lit les données des commandes depuis `ticket.json` et crée un fichier `ids.json` contenant uniquement les IDs des commandes.

### 🔧 Fonction `fetchTransactions`

Envoie une requête POST pour effectuer une transaction pour une commande spécifique.

### 🔧 Fonction `fetchClosure`

Envoie une requête POST pour clôturer une commande spécifique.

### 🔧 Fonction `readIDOrdersFromFile`

Lit les IDs des commandes depuis un fichier JSON.

### ⏳ Fonction `delay`

Introduit un délai synchrone (utilisé entre les requêtes pour éviter de surcharger l'API).

### 🔄 Fonction `runScript`

Fonction principale qui initialise le script et collecte les entrées utilisateur.

### 🔄 Fonction `runScriptWithArgs`

Fonction auxiliaire qui exécute le script avec les arguments fournis.

---

## ▶️ Exécuter le Script

Pour lancer le script, utilisez la commande suivante dans votre terminal :

```bash
node automatisation_cloture_cmd.js
```

Suivez les instructions à l'écran pour fournir le token Bearer, le chemin du fichier `ids.json` et le chemin du fichier `results.json`.

## ✒️ Auteurs

- **Taurouf**
