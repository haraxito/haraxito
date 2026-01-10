# 🚨 CORRECTION RAPIDE - Clé Supabase Invalide

## LE PROBLÈME

Votre fichier `.env.local` contient une clé **invalide** :

```bash
❌ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...VOTRE_ANON_KEY_ICI
                                        ^^^^^^^^^^^^^^^^^^
                                        Placeholder invalide !
```

## LA SOLUTION (3 ÉTAPES - 5 MINUTES)

### 📋 ÉTAPE 1 : Récupérer la Vraie Clé

1. **Ouvrir ce lien dans votre navigateur :**
   ```
   https://supabase.com/dashboard/project/mnjrloqjkpdktkptzjum/settings/api
   ```

2. **Trouver la section "Project API keys"**

   Vous verrez ceci :
   ```
   ┌────────────────────────────────────────────────┐
   │ Project URL                                    │
   │ https://mnjrloqjkpdktkptzjum.supabase.co      │
   └────────────────────────────────────────────────┘

   ┌────────────────────────────────────────────────┐
   │ anon public                                    │
   │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...   │
   │                                                │
   │ [Copy]  👈 CLIQUER ICI                         │
   └────────────────────────────────────────────────┘

   ┌────────────────────────────────────────────────┐
   │ service_role                                   │
   │ ⚠️ Secret                                       │
   │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...   │
   │                                                │
   │ [Copy]  👈 ET CLIQUER ICI AUSSI                │
   └────────────────────────────────────────────────┘
   ```

3. **Copier les DEUX clés** (cliquer sur "Copy" pour chacune)

---

### ✏️ ÉTAPE 2 : Mettre à Jour `.env.local`

1. **Ouvrir le fichier** `.env.local` dans votre éditeur

2. **Remplacer la ligne 5** (anon key)

   ❌ **AVANT** :
   ```bash
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...VOTRE_ANON_KEY_ICI
   ```

   ✅ **APRÈS** :
   ```bash
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[COLLER LA CLIÉ COMPLÈTE ICI]
   ```

3. **Vérifier la ligne 8** (service_role key)

   Elle devrait déjà être bonne, mais vérifiez qu'elle ne contient pas de placeholder.

4. **Sauvegarder** (Ctrl+S ou Cmd+S)

---

### ✅ ÉTAPE 3 : Vérifier Que Ça Marche

1. **Ouvrir un terminal** dans votre projet

2. **Lancer le diagnostic** :
   ```bash
   node debug-supabase.js
   ```

3. **Résultat attendu** :
   ```
   ✅ NEXT_PUBLIC_SUPABASE_URL
   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY     👈 DEVRAIT ÊTRE VERT !
   ✅ SUPABASE_SERVICE_ROLE_KEY
   ✅ RESEND_API_KEY

   ✅ CONFIGURATION LOCALE VALIDE        👈 CE MESSAGE DOIT APPARAÎTRE
   ```

---

## 🎉 C'EST BON ?

Si vous voyez `✅ CONFIGURATION LOCALE VALIDE`, félicitations ! Votre configuration est correcte.

### Prochaines étapes :

1. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

2. **Tester l'API** (dans un nouveau terminal) :
   ```bash
   node test-booking-api.js
   ```

3. **Lire le guide complet** :
   - [GUIDE-DEBUTANT.md](GUIDE-DEBUTANT.md) pour tout comprendre
   - [SETUP-GUIDE.md](SETUP-GUIDE.md) pour la configuration Vercel

---

## ❌ ENCORE DES ERREURS ?

### Si vous voyez encore `❌ NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Vérifications :**

1. ✅ La clé commence par `eyJ` ?
2. ✅ La clé a **3 parties** séparées par des points (`.`) ?
3. ✅ La clé fait environ **200-300 caractères** ?
4. ✅ Il n'y a **PAS** de mot comme `VOTRE_` ou `_ICI` dans la clé ?
5. ✅ Vous avez **sauvegardé** le fichier `.env.local` ?

**Exemple de clé VALIDE :**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uanJsb3Fqa3Bka3RrcHR6anVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTg0ODYsImV4cCI6MjA4MzM5NDQ4Nn0.dQp3M_Rx-WMZHVpf5XQH7eEWqJ9wN2vKx...
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^^^^^^^^^^^^
        PARTIE 1 (header)                    PARTIE 2 (payload)             PARTIE 3 (signature)
```

### Si le diagnostic dit "ECONNREFUSED"

→ Le serveur n'est pas démarré. Lancez :
```bash
npm run dev
```

---

## 🆘 BESOIN D'AIDE ?

1. **Relire** [GUIDE-DEBUTANT.md](GUIDE-DEBUTANT.md) section "Configuration Pas à Pas"
2. **Demander à l'assistant Supabase** de vous donner vos clés
3. **Vérifier** que vous êtes bien connecté à votre projet Supabase

---

**Temps estimé : 5 minutes**

Une fois ce problème résolu, tout le reste devrait fonctionner ! 🚀
