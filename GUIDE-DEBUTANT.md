# 🎓 Guide Complet pour Débutants - Full Stack Next.js + Supabase

Bienvenue ! Ce guide vous explique **étape par étape** comment fonctionne votre application et comment la configurer.

---

## 📚 Table des Matières

1. [Comprendre l'architecture](#1-comprendre-larchitecture)
2. [Les technologies utilisées](#2-les-technologies-utilisées)
3. [Comment ça fonctionne](#3-comment-ça-fonctionne)
4. [Configuration pas à pas](#4-configuration-pas-à-pas)
5. [Tester votre application](#5-tester-votre-application)
6. [Déployer en production](#6-déployer-en-production)
7. [Résoudre les problèmes](#7-résoudre-les-problèmes)

---

## 1. Comprendre l'Architecture

### Qu'est-ce qu'une application Full Stack ?

Une application **Full Stack** a deux parties :

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                     │
│  (Ce que l'utilisateur voit dans son navigateur)│
│                                                 │
│  - Formulaires                                  │
│  - Boutons                                      │
│  - Interface graphique                          │
│                                                 │
│  Technologies : React, Next.js, HTML, CSS       │
└─────────────────────────────────────────────────┘
                        ↕️
┌─────────────────────────────────────────────────┐
│                    BACKEND                      │
│      (La logique serveur et la base de données) │
│                                                 │
│  - API (routes /api/...)                        │
│  - Validation des données                       │
│  - Envoi d'emails                               │
│  - Communication avec la base de données        │
│                                                 │
│  Technologies : Next.js, Node.js                │
└─────────────────────────────────────────────────┘
                        ↕️
┌─────────────────────────────────────────────────┐
│               BASE DE DONNÉES                   │
│         (Stockage permanent des données)        │
│                                                 │
│  - Table rendez_vous                            │
│  - Données clients                              │
│  - Historique des réservations                  │
│                                                 │
│  Technologie : Supabase (PostgreSQL)            │
└─────────────────────────────────────────────────┘
```

### Votre Application : Parebrise Instant

C'est un système de **prise de rendez-vous** pour le remplacement de pare-brise.

**Flux utilisateur :**
1. 👤 Client remplit le formulaire sur le site
2. 📡 Données envoyées à l'API `/api/booking`
3. ✅ API valide les données
4. 💾 API enregistre dans Supabase
5. 📧 Emails envoyés (client + admin)
6. 🎉 Confirmation affichée au client

---

## 2. Les Technologies Utilisées

### 🔷 Next.js (Framework React)

**C'est quoi ?**
- Un framework JavaScript pour créer des sites web modernes
- Permet de faire du **frontend** (pages web) et du **backend** (API)

**Dans votre projet :**
- `app/page.tsx` → Page d'accueil
- `app/admin/page.tsx` → Dashboard admin
- `app/api/booking/route.ts` → API de réservation

**Commandes :**
```bash
npm run dev    # Démarrer en développement (local)
npm run build  # Compiler pour la production
npm start      # Démarrer en production
```

---

### 🔷 Supabase (Base de données)

**C'est quoi ?**
- Une base de données PostgreSQL dans le cloud
- Alternative open-source à Firebase
- Fournit une API REST automatique

**Dans votre projet :**
- Table `rendez_vous` stocke les réservations
- Politiques RLS (Row Level Security) pour la sécurité
- Deux types de clés :
  - **anon key** (publique) : Pour le frontend
  - **service_role key** (secrète) : Pour le backend

**Dashboard Supabase :**
```
https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum
```

---

### 🔷 Vercel (Hébergement)

**C'est quoi ?**
- Plateforme cloud pour héberger des sites Next.js
- Déploiement automatique depuis Git
- Gratuit pour les petits projets

**Commandes :**
```bash
vercel         # Déployer en preview
vercel --prod  # Déployer en production
vercel logs    # Voir les logs
```

---

### 🔷 Resend (Envoi d'emails)

**C'est quoi ?**
- Service pour envoyer des emails via API
- Alternative à SendGrid, Mailgun

**Dans votre projet :**
- Email de confirmation au client
- Email de notification à l'admin

---

## 3. Comment Ça Fonctionne

### Fichiers Importants

```
votre-projet/
│
├── app/                          # Pages et routes
│   ├── page.tsx                  # Page d'accueil (/)
│   ├── admin/
│   │   ├── page.tsx              # Dashboard admin (/admin)
│   │   └── login/page.tsx        # Login admin (/admin/login)
│   └── api/
│       ├── booking/route.ts      # API réservation (POST /api/booking)
│       └── admin/auth/route.ts   # API authentification admin
│
├── lib/                          # Utilitaires et configuration
│   ├── supabaseClient.ts         # Configuration Supabase
│   ├── env.ts                    # Validation des variables d'env
│   ├── resend.ts                 # Configuration emails
│   └── auth.ts                   # Gestion sessions admin
│
├── .env.local                    # Variables d'environnement (LOCAL)
├── supabase.sql                  # Script SQL pour créer la table
├── package.json                  # Dépendances du projet
│
└── Scripts de debug (nouveaux !)
    ├── debug-supabase.js         # Diagnostic complet
    ├── test-booking-api.js       # Test de l'API
    ├── SETUP-GUIDE.md            # Guide de configuration
    └── GUIDE-DEBUTANT.md         # Ce guide !
```

---

### Le Cycle de Vie d'une Réservation

#### 1️⃣ **Client remplit le formulaire** (`BookingForm.tsx`)

```typescript
// Données du formulaire
{
  nom: "Jean Dupont",
  telephone: "0601020304",
  email: "jean@example.com",
  vehicule: "2020 Renault Clio",
  typeService: "DOMICILE",
  adresse: "15 Rue de Paris",
  preferredDate: "2026-01-15"
}
```

#### 2️⃣ **Envoi à l'API** (POST `/api/booking`)

```javascript
fetch('/api/booking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

#### 3️⃣ **API valide les données** (`app/api/booking/route.ts`)

```typescript
// Vérifications :
- Nom présent ? ✅
- Téléphone présent ? ✅
- Véhicule présent ? ✅
- Type service = DOMICILE ou ATELIER ? ✅
- Si DOMICILE, adresse présente ? ✅
```

#### 4️⃣ **Insertion dans Supabase**

```typescript
await supabaseAdmin()
  .from('rendez_vous')
  .insert([{
    client_nom: nom,
    client_telephone: telephone,
    // ... autres champs
  }])
```

#### 5️⃣ **Envoi des emails**

```typescript
// Email au client
sendClientConfirmationEmail(data)

// Email à l'admin
sendAdminNotificationEmail(data)
```

#### 6️⃣ **Réponse au client**

```json
{
  "success": true,
  "message": "Demande enregistrée avec succès",
  "booking": { ... }
}
```

---

## 4. Configuration Pas à Pas

### Étape 1 : Récupérer les Clés Supabase

#### Pourquoi ?
Votre fichier `.env.local` contient des **placeholders** invalides. Il faut les remplacer par les **vraies clés**.

#### Comment ?

1. **Ouvrir le Dashboard Supabase**
   ```
   https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/settings/api
   ```

2. **Copier les clés**

   Dans la section "Project API keys", vous verrez :

   ```
   ┌─────────────────────────────────────┐
   │ Project URL                         │
   │ https://mnjrlo...supabase.co        │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │ anon public                         │
   │ eyJhbGc....[LONGUE CLÉ]             │
   │ [Copier] 📋                          │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │ service_role                        │
   │ ⚠️ Secret - Keep it safe            │
   │ eyJhbGc....[LONGUE CLÉ]             │
   │ [Copier] 📋                          │
   └─────────────────────────────────────┘
   ```

3. **Important** : Une clé JWT valide ressemble à ça :
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uanJsb3Fqa3Bka3RrcHR6anVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg0ODYsImV4cCI6MjA4MzM5NDQ4Nn0.dMPc1M_Rx-WMZHVpf5XQHdEWqJ3wN2...
   ```

   ✅ 3 parties séparées par des points (`.`)
   ✅ Commence par `eyJ`
   ✅ Environ 200-300 caractères

---

### Étape 2 : Mettre à Jour `.env.local`

1. **Ouvrir le fichier** `.env.local` dans votre éditeur

2. **Trouver la ligne 5** (celle avec `VOTRE_ANON_KEY_ICI`)

3. **Remplacer TOUTE la ligne** par :
   ```bash
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[COLLER LA VRAIE CLÉ ANON ICI]
   ```

4. **Vérifier la ligne 8** (service_role)
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJ[COLLER LA VRAIE CLÉ SERVICE_ROLE ICI]
   ```

5. **Sauvegarder** le fichier (Ctrl+S ou Cmd+S)

---

### Étape 3 : Vérifier la Configuration

1. **Ouvrir un terminal** dans votre projet

2. **Lancer le diagnostic**
   ```bash
   node debug-supabase.js
   ```

3. **Résultat attendu :**
   ```
   ✅ NEXT_PUBLIC_SUPABASE_URL
   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  ← Devrait être vert maintenant !
   ✅ SUPABASE_SERVICE_ROLE_KEY
   ✅ RESEND_API_KEY
   ```

4. **Si vous voyez encore ❌**, relisez les étapes ci-dessus

---

### Étape 4 : Créer la Table dans Supabase

#### Option A : Via l'Interface Web (Plus Simple)

1. **Aller sur l'éditeur SQL**
   ```
   https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/editor
   ```

2. **Cliquer sur "SQL Editor"** (menu latéral gauche)

3. **Cliquer sur "New Query"**

4. **Copier-coller** le contenu de `supabase.sql`
   - Ouvrir le fichier `supabase.sql` de votre projet
   - Sélectionner tout (Ctrl+A / Cmd+A)
   - Copier (Ctrl+C / Cmd+C)
   - Coller dans l'éditeur SQL de Supabase

5. **Cliquer sur "Run"** (bouton vert en bas, ou Ctrl+Enter)

6. **Vérifier** : Aller dans "Table Editor", vous devriez voir `rendez_vous`

#### Option B : Via l'Assistant Supabase (Automatique)

Demander à l'assistant Supabase :

```
Créez ma table rendez_vous avec ce script :

[Coller le contenu de supabase.sql]

Options :
- Supprimer les anciennes politiques : OUI
- Contraintes email/téléphone : NON
- Données de test : OUI (2-3 exemples)
- Edge Function : NON
```

---

### Étape 5 : Tester en Local

1. **Démarrer le serveur**
   ```bash
   npm run dev
   ```

   Vous devriez voir :
   ```
   ✅ All required environment variables are configured
   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   ```

2. **Tester le health check**

   Ouvrir un **nouveau terminal** et exécuter :
   ```bash
   curl http://localhost:3000/api/booking
   ```

   Réponse attendue :
   ```json
   {
     "status": "ok",
     "supabase": "configured",
     "resend": "configured",
     "envValid": true
   }
   ```

3. **Tester une réservation complète**
   ```bash
   node test-booking-api.js
   ```

   Vous devriez voir :
   ```
   ✅ Réservation créée avec succès !
   ```

---

### Étape 6 : Vérifier dans Supabase

1. **Aller sur la Table Editor**
   ```
   https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/editor
   ```

2. **Cliquer sur la table `rendez_vous`**

3. **Voir les données** : Vous devriez voir la réservation de test !

---

## 5. Tester Votre Application

### Test 1 : Page d'Accueil

1. Ouvrir `http://localhost:3000`
2. Remplir le formulaire
3. Cliquer sur "Envoyer"
4. ✅ Message de confirmation

### Test 2 : Dashboard Admin

1. Ouvrir `http://localhost:3000/admin`
2. Si pas connecté → Redirection vers `/admin/login`
3. Mot de passe : `parebrise2026`
4. ✅ Voir toutes les réservations

### Test 3 : Emails

1. Vérifier l'inbox de `ADMIN_EMAIL`
2. ✅ Email reçu avec les détails de la réservation
3. Si le client a donné un email, il reçoit aussi une confirmation

---

## 6. Déployer en Production

### Installer Vercel CLI

```bash
npm install -g vercel
```

### Se Connecter

```bash
vercel login
```

(Un navigateur s'ouvre, connectez-vous avec GitHub/Email)

### Lier le Projet

```bash
vercel link
```

Questions :
- **Scope ?** → Votre compte
- **Link to existing project ?** → No
- **Project name ?** → (suggéré automatiquement, appuyez sur Entrée)

### Ajouter les Variables d'Environnement

**IMPORTANT** : Copiez les VRAIES valeurs de votre `.env.local` !

```bash
# URL Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Coller : https://mnjrloqjkpdktkptzjum.supabase.co
# Sélectionner : Production + Preview + Development (Espace pour sélectionner)

# Clé ANON
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Coller : [Votre vraie clé anon]
# Sélectionner : Production + Preview + Development

# Clé SERVICE_ROLE (SECRET!)
vercel env add SUPABASE_SERVICE_ROLE_KEY
# Coller : [Votre vraie clé service_role]
# Sélectionner : Production + Preview + Development

# Autres variables
vercel env add RESEND_API_KEY
vercel env add ADMIN_EMAIL
vercel env add RESEND_FROM_EMAIL
vercel env add ADMIN_PASSWORD
```

### Déployer

```bash
vercel --prod
```

Attendez quelques minutes...

```
✅ Production: https://windsheild-remplacement.vercel.app
```

### Tester en Production

```bash
curl https://VOTRE-URL.vercel.app/api/booking
```

---

## 7. Résoudre les Problèmes

### ❌ "Invalid JWT format"

**Cause** : Votre clé Supabase est incorrecte

**Solution** :
1. Retourner sur https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/settings/api
2. Re-copier la clé COMPLÈTE
3. Vérifier qu'elle a 3 parties séparées par `.`
4. Mettre à jour `.env.local`
5. Redémarrer `npm run dev`

---

### ❌ "Database connection not configured"

**Cause** : Les variables d'environnement ne sont pas chargées

**Solution** :
1. Vérifier que `.env.local` existe à la **racine** du projet
2. Relancer `node debug-supabase.js`
3. Redémarrer le serveur

---

### ❌ "ECONNREFUSED"

**Cause** : Le serveur n'est pas démarré

**Solution** :
```bash
npm run dev
```

---

### ❌ "Row Level Security policy violation"

**Cause** : Les politiques RLS bloquent l'accès

**Solution** :
1. Vérifier que `supabase.sql` a été exécuté
2. Vérifier dans Supabase : Table Editor → rendez_vous → RLS enabled
3. Utiliser `supabaseAdmin()` dans le code serveur

---

### ❌ Emails non reçus

**Cause** : Configuration Resend ou email bloqué

**Solution** :
1. Vérifier que `RESEND_API_KEY` commence par `re_`
2. Vérifier l'email FROM sur https://resend.com/domains
3. Vérifier les spams
4. Consulter les logs : https://resend.com/emails

---

## 📖 Glossaire pour Débutants

| Terme | Explication |
|-------|-------------|
| **API** | Interface de Programmation : permet au frontend de communiquer avec le backend |
| **JWT** | JSON Web Token : format de clé sécurisée |
| **RLS** | Row Level Security : sécurité au niveau des lignes de la base de données |
| **Environment Variable** | Variable de configuration (ex: clés API) |
| **Route Handler** | Fonction qui gère une URL (ex: `/api/booking`) |
| **anon key** | Clé publique Supabase (peut être exposée) |
| **service_role key** | Clé privée Supabase (JAMAIS exposer côté client) |
| **Health Check** | Endpoint pour vérifier que l'API fonctionne |
| **CRUD** | Create, Read, Update, Delete (opérations de base de données) |

---

## 🎯 Checklist de Déploiement

Avant de considérer que tout fonctionne :

### En Local
- [ ] `.env.local` configuré avec vraies clés
- [ ] `node debug-supabase.js` → ✅ CONFIGURATION LOCALE VALIDE
- [ ] `npm run dev` démarre sans erreur
- [ ] Health check OK : `curl http://localhost:3000/api/booking`
- [ ] Test booking OK : `node test-booking-api.js`
- [ ] Page d'accueil fonctionne
- [ ] Dashboard admin accessible

### Supabase
- [ ] Table `rendez_vous` créée
- [ ] Politiques RLS activées
- [ ] Données de test visibles

### Vercel
- [ ] Variables d'environnement ajoutées
- [ ] `vercel env ls` liste toutes les variables
- [ ] Déploiement réussi
- [ ] Health check en production OK

---

## 💡 Conseils pour Continuer à Apprendre

1. **Lire les logs** : Les messages d'erreur contiennent souvent la solution
2. **Console du navigateur** : F12 pour voir les erreurs frontend
3. **Documentation** :
   - Next.js : https://nextjs.org/docs
   - Supabase : https://supabase.com/docs
   - Vercel : https://vercel.com/docs
4. **Modifier le code progressivement** : Changez une chose à la fois
5. **Git** : Faites des commits réguliers pour sauvegarder votre progression

---

**Bon courage ! 🚀**

Si vous êtes bloqué, relisez ce guide étape par étape et vérifiez chaque élément de la checklist.
