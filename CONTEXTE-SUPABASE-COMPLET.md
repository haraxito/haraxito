# 📋 Contexte Complet du Projet - Pour Assistant Supabase

## 🎯 OBJECTIF DU PROJET

Je développe une **application web de prise de rendez-vous** pour un service de remplacement de pare-brise automobile au Québec/Canada. L'application permet aux clients de réserver un rendez-vous en ligne, soit à domicile (service mobile) soit en atelier.

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack Technologique
- **Frontend** : Next.js 14 (React) + TailwindCSS
- **Backend** : Next.js API Routes (Node.js)
- **Base de données** : Supabase (PostgreSQL)
- **Emails** : Resend API
- **Déploiement** : Vercel
- **Authentification Admin** : Cookies httpOnly (sessions)

### URL du Projet Supabase
```
https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum
```

---

## 🗄️ SCHÉMA DE BASE DE DONNÉES

### Table Principale : `rendez_vous`

Cette table stocke **toutes les demandes de rendez-vous** des clients.

#### Structure Complète

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `bigint` | PRIMARY KEY, AUTO-INCREMENT | Identifiant unique de la réservation |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Date et heure de création automatique |
| `client_nom` | `text` | NOT NULL | Nom complet du client (ex: "Jean Dupont") |
| `client_telephone` | `text` | NOT NULL | Numéro de téléphone (ex: "514-123-4567") |
| `client_email` | `text` | NULL | Email du client (optionnel mais recommandé) |
| `vehicule_infos` | `text` | NOT NULL | Informations complètes du véhicule (voir format ci-dessous) |
| `type_service` | `text` | NOT NULL, CHECK | "DOMICILE" ou "ATELIER" uniquement |
| `adresse_intervention` | `text` | NULL | Adresse complète si type_service = DOMICILE |
| `date_souhaitee` | `date` | NOT NULL | Date préférée par le client pour le rendez-vous |
| `statut` | `text` | NOT NULL, DEFAULT 'Nouveau' | Statut de la demande (Nouveau, Confirmé, En cours, Terminé, Annulé) |

#### Format du Champ `vehicule_infos`

Ce champ texte contient plusieurs informations séparées par des pipes (`|`) :

**Format** :
```
[MARQUE] [MODÈLE] [ANNÉE] | Assurance: [NOM_ASSURANCE] | Dommage: [TYPE_DOMMAGE]
```

**Exemples réels** :
```
Toyota Corolla 2020 | Assurance: Desjardins | Dommage: crack
Honda Civic 2019 | Dommage: chip
Ford F-150 2021 | Assurance: Intact | Dommage: shattered
```

**Types de dommages possibles** :
- `crack` → Fissure (longue fracture)
- `chip` → Éclat (petit impact)
- `shattered` → Brisé (pare-brise complètement cassé)

**Marques automobiles supportées** (29 marques populaires au Canada) :
Acura, Audi, BMW, Buick, Cadillac, Chevrolet, Chrysler, Dodge, Ford, GMC, Honda, Hyundai, Infiniti, Jeep, Kia, Lexus, Lincoln, Mazda, Mercedes-Benz, Mini, Mitsubishi, Nissan, Ram, Subaru, Tesla, Toyota, Volkswagen, Volvo, Autre

---

## 🔐 POLITIQUES DE SÉCURITÉ (ROW LEVEL SECURITY)

### Politique 1 : Insertion Publique
```sql
create policy "public_insert_rendez_vous"
  on public.rendez_vous
  for insert
  to anon, authenticated
  with check (true);
```

**Objectif** : Permettre à **n'importe quel utilisateur** (anonyme ou authentifié) de créer une réservation via le formulaire web.

**Cas d'usage** : Quand un client remplit le formulaire sur le site, l'API Next.js peut insérer la réservation.

---

### Politique 2 : Lecture Admin (via JWT)
```sql
create policy "admins_can_select_rendez_vous"
  on public.rendez_vous
  for select
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');
```

**Objectif** : Seuls les utilisateurs authentifiés avec le rôle `admin` dans leur JWT peuvent lire les réservations.

**Cas d'usage** : Si on implémente une vraie authentification Supabase Auth (actuellement non utilisé, on utilise des cookies simples côté Next.js).

---

### Politique 3 : Lecture Service Role (Bypass RLS)
```sql
create policy "service_role_can_select_rendez_vous"
  on public.rendez_vous
  for select
  to service_role
  using (true);
```

**Objectif** : Permettre au **service_role key** (clé secrète côté serveur) de lire toutes les réservations sans restriction.

**Cas d'usage** : Le dashboard admin (`/admin`) utilise la `service_role_key` côté serveur pour afficher toutes les réservations.

---

## 🔍 INDEX POUR PERFORMANCE

```sql
-- Index pour tri par date de création (dashboard admin)
create index rendez_vous_created_at_idx on public.rendez_vous (created_at desc);

-- Index pour recherche par date souhaitée
create index rendez_vous_date_souhaitee_idx on public.rendez_vous (date_souhaitee);

-- Index pour filtrage par type de service
create index rendez_vous_type_service_idx on public.rendez_vous (type_service);
```

**Objectif** : Accélérer les requêtes suivantes :
- Affichage du dashboard trié par date de création (les plus récents en premier)
- Recherche de rendez-vous à une date précise
- Filtrage par type de service (DOMICILE vs ATELIER)

---

## ✅ CONTRAINTES DE VALIDATION

### Contrainte 1 : Type de Service Valide
```sql
check (type_service in ('DOMICILE','ATELIER'))
```

**Objectif** : S'assurer que seules les valeurs "DOMICILE" ou "ATELIER" sont acceptées.

---

### Contrainte 2 : Adresse Conditionnelle
```sql
constraint adresse_domicle_check check (
  (type_service = 'DOMICILE' and adresse_intervention is not null)
  or (type_service = 'ATELIER' and adresse_intervention is null)
)
```

**Objectif** : Règle métier importante :
- Si `type_service = 'DOMICILE'` → l'adresse **DOIT** être renseignée (service mobile)
- Si `type_service = 'ATELIER'` → l'adresse **DOIT** être null (client vient à nous)

**Exemples valides** :
```sql
-- ✅ Service à domicile avec adresse
type_service = 'DOMICILE' AND adresse_intervention = '123 Rue Principale, Montréal QC'

-- ✅ Service en atelier sans adresse
type_service = 'ATELIER' AND adresse_intervention = NULL
```

**Exemples invalides** :
```sql
-- ❌ Service à domicile sans adresse
type_service = 'DOMICILE' AND adresse_intervention = NULL

-- ❌ Service en atelier avec adresse
type_service = 'ATELIER' AND adresse_intervention = '123 Rue...'
```

---

## 📊 WORKFLOW DE DONNÉES

### 1. Création d'une Réservation (Frontend → API → Supabase)

```
┌─────────────────────────┐
│  Client remplit         │
│  le formulaire web      │
│  (BookingForm.tsx)      │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│  POST /api/booking      │
│  (Next.js API Route)    │
└───────────┬─────────────┘
            │
            ├→ Validation des champs requis
            ├→ Construction de vehicule_infos
            ├→ Vérification type_service
            ├→ Vérification adresse si DOMICILE
            │
            ↓
┌─────────────────────────┐
│  supabaseAdmin()        │
│  .from('rendez_vous')   │
│  .insert([...])         │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│  Table rendez_vous      │
│  ✅ Nouvelle ligne      │
└───────────┬─────────────┘
            │
            ├→ Email client (Resend)
            ├→ Email admin (Resend)
            │
            ↓
┌─────────────────────────┐
│  Réponse 201 Created    │
│  avec booking data      │
└─────────────────────────┘
```

### 2. Lecture des Réservations (Dashboard Admin)

```
┌─────────────────────────┐
│  Admin visite /admin    │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│  Vérification cookie    │
│  admin_session          │
└───────────┬─────────────┘
            │
            ↓ (si authentifié)
┌─────────────────────────┐
│  supabaseAdmin()        │
│  .from('rendez_vous')   │
│  .select('*')           │
│  .order('created_at')   │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│  Affichage dashboard    │
│  avec stats & cards     │
└─────────────────────────┘
```

---

## 🔑 CLÉS API NÉCESSAIRES

### Clé Publique (ANON KEY)
```
Nom : NEXT_PUBLIC_SUPABASE_ANON_KEY
Usage : Frontend (navigateur)
Format : JWT (eyJ...)
Permissions : Insert uniquement (via RLS policy)
```

### Clé Privée (SERVICE_ROLE KEY)
```
Nom : SUPABASE_SERVICE_ROLE_KEY
Usage : Backend serveur uniquement
Format : JWT (eyJ...)
Permissions : Bypass RLS, accès complet
⚠️ NE JAMAIS EXPOSER CÔTÉ CLIENT
```

---

## 📧 INTÉGRATION EMAIL (RESEND)

Après chaque insertion réussie dans `rendez_vous`, deux emails sont envoyés :

### Email 1 : Confirmation Client
**À** : `client_email` (si fourni)
**Sujet** : "✅ Confirmation de votre demande - Parebrise Instant"
**Contenu** :
- Récapitulatif de la demande
- Détails du véhicule
- Type de service et adresse
- Date souhaitée
- Message du client
- Contact pour questions

### Email 2 : Notification Admin
**À** : `ADMIN_EMAIL` (variable d'environnement)
**Sujet** : "🔔 Nouvelle demande - [Nom Client] ([Type Service])"
**Contenu** :
- Informations de contact du client
- Détails complets de la réservation
- Liens d'action rapide (appeler, voir dans dashboard)

---

## 🎨 EXEMPLES DE DONNÉES RÉELLES

### Exemple 1 : Service à Domicile avec Assurance

```sql
INSERT INTO rendez_vous (
  client_nom,
  client_telephone,
  client_email,
  vehicule_infos,
  type_service,
  adresse_intervention,
  date_souhaitee,
  statut
) VALUES (
  'Marie Tremblay',
  '514-555-1234',
  'marie.tremblay@gmail.com',
  'Honda Civic 2020 | Assurance: Desjardins | Dommage: crack',
  'DOMICILE',
  '456 Avenue du Parc, Montréal QC H2X 2L3',
  '2026-01-15',
  'Nouveau'
);
```

### Exemple 2 : Service en Atelier sans Email

```sql
INSERT INTO rendez_vous (
  client_nom,
  client_telephone,
  client_email,
  vehicule_infos,
  type_service,
  adresse_intervention,
  date_souhaitee,
  statut
) VALUES (
  'Jean Bouchard',
  '438-555-9876',
  NULL,
  'Ford F-150 2019 | Dommage: chip',
  'ATELIER',
  NULL,
  '2026-01-18',
  'Nouveau'
);
```

### Exemple 3 : Tesla avec Assurance Complete

```sql
INSERT INTO rendez_vous (
  client_nom,
  client_telephone,
  client_email,
  vehicule_infos,
  type_service,
  adresse_intervention,
  date_souhaitee,
  statut
) VALUES (
  'Sophie Gagnon',
  '450-555-3333',
  'sophie@example.com',
  'Tesla Model 3 2023 | Assurance: Intact | Dommage: shattered',
  'DOMICILE',
  '789 Chemin des Prairies, Laval QC H7W 1A1',
  '2026-01-20',
  'Nouveau'
);
```

---

## 🎯 REQUÊTES SQL COURANTES

### Récupérer toutes les réservations (tri par date)
```sql
SELECT * FROM rendez_vous
ORDER BY created_at DESC;
```

### Récupérer uniquement les nouvelles demandes
```sql
SELECT * FROM rendez_vous
WHERE statut = 'Nouveau'
ORDER BY created_at DESC;
```

### Compter les réservations par type de service
```sql
SELECT
  type_service,
  COUNT(*) as nombre
FROM rendez_vous
GROUP BY type_service;
```

### Récupérer les réservations d'une date précise
```sql
SELECT * FROM rendez_vous
WHERE date_souhaitee = '2026-01-15'
ORDER BY created_at;
```

### Statistiques pour le dashboard
```sql
SELECT
  COUNT(*) FILTER (WHERE statut = 'Nouveau') as nouveaux,
  COUNT(*) FILTER (WHERE type_service = 'DOMICILE') as domicile,
  COUNT(*) FILTER (WHERE statut = 'Confirmé') as confirmes,
  COUNT(*) as total
FROM rendez_vous;
```

---

## 🔄 CYCLE DE VIE D'UNE RÉSERVATION

```
Nouveau
  ↓
  (Admin contacte le client)
  ↓
Confirmé
  ↓
  (Technicien se rend sur place / client arrive)
  ↓
En cours
  ↓
  (Travail terminé)
  ↓
Terminé

(ou)

Annulé
```

**Statuts possibles** :
- `Nouveau` : Demande juste reçue (défaut)
- `Confirmé` : Rendez-vous confirmé avec le client
- `En cours` : Technicien sur place / travail en cours
- `Terminé` : Service complété
- `Annulé` : Rendez-vous annulé

---

## ⚠️ PROBLÈMES CONNUS ET SOLUTIONS

### Problème 1 : Clé ANON KEY Invalide
**Symptôme** : Placeholder `VOTRE_ANON_KEY_ICI` dans .env.local
**Solution** : Récupérer la vraie clé depuis Settings > API

### Problème 2 : Insertion Échoue (DOMICILE sans adresse)
**Symptôme** : Erreur "constraint violation"
**Cause** : Contrainte `adresse_domicle_check`
**Solution** : S'assurer que `adresse_intervention` est renseignée si `type_service = 'DOMICILE'`

### Problème 3 : Admin ne Peut Pas Lire les Données
**Symptôme** : Dashboard vide ou erreur RLS
**Cause** : Utilisation du client anon au lieu du service_role
**Solution** : Utiliser `supabaseAdmin()` côté serveur

---

## 🚀 CE QUE JE SOUHAITE QUE TU FASSES

1. ✅ **Créer la table `rendez_vous`** avec toutes les colonnes ci-dessus
2. ✅ **Activer Row Level Security (RLS)** sur la table
3. ✅ **Créer les 3 politiques RLS** :
   - Insertion publique (anon + authenticated)
   - Lecture admin (JWT role='admin')
   - Lecture service_role (bypass RLS)
4. ✅ **Créer les 3 index** pour performance
5. ✅ **Ajouter les 2 contraintes** :
   - CHECK sur type_service
   - CHECK conditionnel sur adresse
6. ✅ **Insérer 3 exemples de données de test** :
   - 1 réservation DOMICILE avec email et assurance
   - 1 réservation ATELIER sans email
   - 1 réservation DOMICILE avec différente marque de véhicule

---

## 📝 SCRIPT SQL COMPLET À EXÉCUTER

Voici le script SQL complet que je souhaite que tu exécutes :

```sql
-- Schema: Auto Glass Booking (rendez_vous)
-- Creates table and Row Level Security (RLS) policies

create schema if not exists public;

create table if not exists public.rendez_vous (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  client_nom text not null,
  client_telephone text not null,
  client_email text null,
  vehicule_infos text not null,
  type_service text not null check (type_service in ('DOMICILE','ATELIER')),
  adresse_intervention text null,
  date_souhaitee date not null,
  statut text not null default 'Nouveau',
  -- Ensure address presence only for DOMICILE
  constraint adresse_domicle_check check (
    (type_service = 'DOMICILE' and adresse_intervention is not null)
    or (type_service = 'ATELIER' and adresse_intervention is null)
  )
);

comment on table public.rendez_vous is 'Prise de rendez-vous pare-brise';
comment on column public.rendez_vous.type_service is 'DOMICILE ou ATELIER';
comment on column public.rendez_vous.adresse_intervention is 'Adresse si DOMICILE';

-- Indexes for admin dashboard sorting/filtering
create index if not exists rendez_vous_created_at_idx on public.rendez_vous (created_at desc);
create index if not exists rendez_vous_date_souhaitee_idx on public.rendez_vous (date_souhaitee);
create index if not exists rendez_vous_type_service_idx on public.rendez_vous (type_service);

-- Enable Row Level Security
alter table public.rendez_vous enable row level security;

-- Public insert: allow both anon and authenticated users to insert bookings
create policy if not exists "public_insert_rendez_vous"
  on public.rendez_vous
  for insert
  to anon, authenticated
  with check (true);

-- Admin read policy: allow only authenticated users with JWT claim role=admin
create policy if not exists "admins_can_select_rendez_vous"
  on public.rendez_vous
  for select
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin');

-- Service role bypass (server-side only). This is safe for server usage.
create policy if not exists "service_role_can_select_rendez_vous"
  on public.rendez_vous
  for select
  to service_role
  using (true);

-- Insert test data (3 examples)
INSERT INTO rendez_vous (client_nom, client_telephone, client_email, vehicule_infos, type_service, adresse_intervention, date_souhaitee, statut) VALUES
('Marie Tremblay', '514-555-1234', 'marie.tremblay@gmail.com', 'Honda Civic 2020 | Assurance: Desjardins | Dommage: crack', 'DOMICILE', '456 Avenue du Parc, Montréal QC H2X 2L3', '2026-01-15', 'Nouveau'),
('Jean Bouchard', '438-555-9876', NULL, 'Ford F-150 2019 | Dommage: chip', 'ATELIER', NULL, '2026-01-18', 'Nouveau'),
('Sophie Gagnon', '450-555-3333', 'sophie@example.com', 'Tesla Model 3 2023 | Assurance: Intact | Dommage: shattered', 'DOMICILE', '789 Chemin des Prairies, Laval QC H7W 1A1', '2026-01-20', 'Nouveau');
```

---

## ✅ VÉRIFICATIONS APRÈS EXÉCUTION

Après avoir exécuté le script, merci de vérifier :

1. ✅ La table `rendez_vous` existe dans le schéma `public`
2. ✅ Les 9 colonnes sont présentes avec les bons types
3. ✅ Row Level Security (RLS) est activé
4. ✅ Les 3 politiques RLS sont créées
5. ✅ Les 3 index sont créés
6. ✅ Les 2 contraintes CHECK fonctionnent
7. ✅ Les 3 lignes de test sont insérées

---

## 🔐 MES CLÉS API

Merci également de me **confirmer mes clés API actuelles** :

**URL Supabase** : `https://mnjrloqjkpdktkptzjum.supabase.co`

J'ai besoin de :
1. **NEXT_PUBLIC_SUPABASE_ANON_KEY** (clé publique)
2. **SUPABASE_SERVICE_ROLE_KEY** (clé privée serveur)

Car j'ai actuellement un problème avec ma clé anon qui contient un placeholder invalide dans mon fichier `.env.local`.

---

## 📞 QUESTIONS / CLARIFICATIONS

Si tu as besoin de clarifications sur :
- La logique métier
- Les règles de validation
- L'utilisation des données
- Les requêtes spécifiques

N'hésite pas à me poser des questions !

---

**Merci pour ton aide ! 🙏**

*Document créé le : 2026-01-09*
*Projet : Parebrise Instant - Application de réservation pare-brise*
*Développeur : Débutant en full stack*
