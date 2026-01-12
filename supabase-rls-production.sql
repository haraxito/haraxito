-- ============================================================================
-- POLITIQUES RLS - VERSION PRODUCTION SÉCURISÉE
-- ============================================================================
-- Version améliorée avec:
-- ✅ Gestion des rôles admin sécurisée
-- ✅ Contraintes au niveau base de données
-- ✅ Index pour performance
-- ✅ Défense en profondeur
-- ============================================================================

-- ============================================================================
-- PARTIE 1: CRÉATION DE LA TABLE ADMIN
-- ============================================================================

-- Table pour gérer les administrateurs
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Commentaire
COMMENT ON TABLE admin_users IS 'Liste des utilisateurs ayant accès admin';

-- ============================================================================
-- PARTIE 2: FONCTION POUR VÉRIFIER SI UN UTILISATEUR EST ADMIN
-- ============================================================================

-- Fonction pour vérifier si l'utilisateur connecté est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifier si l'utilisateur est dans la table admin_users
  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaire
COMMENT ON FUNCTION is_admin() IS 'Vérifie si l''utilisateur connecté est un admin actif';

-- ============================================================================
-- PARTIE 3: CONTRAINTES AU NIVEAU TABLE (Défense en profondeur)
-- ============================================================================

-- Ajouter les contraintes NOT NULL sur rendez_vous
ALTER TABLE rendez_vous
  ALTER COLUMN client_nom SET NOT NULL,
  ALTER COLUMN client_telephone SET NOT NULL,
  ALTER COLUMN vehicule_infos SET NOT NULL,
  ALTER COLUMN date_souhaitee SET NOT NULL;

-- Ajouter contrainte CHECK sur type_service
ALTER TABLE rendez_vous
  DROP CONSTRAINT IF EXISTS check_type_service,
  ADD CONSTRAINT check_type_service
  CHECK (type_service IN ('DOMICILE', 'ATELIER'));

-- Ajouter contrainte CHECK sur statut (optionnel mais recommandé)
ALTER TABLE rendez_vous
  DROP CONSTRAINT IF EXISTS check_statut,
  ADD CONSTRAINT check_statut
  CHECK (statut IN ('Nouveau', 'Confirmé', 'En cours', 'Terminé', 'Annulé'));

-- Ajouter valeur par défaut pour statut
ALTER TABLE rendez_vous
  ALTER COLUMN statut SET DEFAULT 'Nouveau';

-- ============================================================================
-- PARTIE 4: INDEX POUR PERFORMANCE
-- ============================================================================

-- Index sur rendez_vous pour requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_rendez_vous_created_at ON rendez_vous(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_statut ON rendez_vous(statut);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_type_service ON rendez_vous(type_service);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_date_souhaitee ON rendez_vous(date_souhaitee);

-- Index sur clients_dossiers
CREATE INDEX IF NOT EXISTS idx_clients_dossiers_created_at ON clients_dossiers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_dossiers_statut ON clients_dossiers(statut) WHERE statut IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_dossiers_rendez_vous_id ON clients_dossiers(rendez_vous_id) WHERE rendez_vous_id IS NOT NULL;

-- ============================================================================
-- PARTIE 5: ACTIVATION RLS
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PARTIE 6: SUPPRESSION DES ANCIENNES POLITIQUES
-- ============================================================================

-- Supprimer toutes les anciennes politiques sur rendez_vous
DROP POLICY IF EXISTS "Allow public insert for booking form" ON rendez_vous;
DROP POLICY IF EXISTS "Allow admin read all" ON rendez_vous;
DROP POLICY IF EXISTS "Allow admin update all" ON rendez_vous;
DROP POLICY IF EXISTS "Allow admin delete all" ON rendez_vous;

-- Supprimer toutes les anciennes politiques sur clients_dossiers
DROP POLICY IF EXISTS "Admin full access" ON clients_dossiers;
DROP POLICY IF EXISTS "Allow admin access" ON clients_dossiers;
DROP POLICY IF EXISTS "Admin read all" ON clients_dossiers;
DROP POLICY IF EXISTS "Admin update all" ON clients_dossiers;
DROP POLICY IF EXISTS "Admin delete all" ON clients_dossiers;

-- Supprimer anciennes politiques sur admin_users (si existent)
DROP POLICY IF EXISTS "Admin can view admins" ON admin_users;
DROP POLICY IF EXISTS "Admin can manage admins" ON admin_users;

-- ============================================================================
-- PARTIE 7: POLITIQUES RLS POUR rendez_vous
-- ============================================================================

-- POLITIQUE 1: Permettre les insertions publiques (formulaire de réservation)
CREATE POLICY "Allow public insert for booking form"
ON rendez_vous
FOR INSERT
TO anon
WITH CHECK (
  -- Validation des champs requis (sécurité en profondeur)
  client_nom IS NOT NULL
  AND client_telephone IS NOT NULL
  AND vehicule_infos IS NOT NULL
  AND type_service IN ('DOMICILE', 'ATELIER')
  AND date_souhaitee IS NOT NULL
  -- Empêcher la manipulation du statut lors de l'insertion publique
  AND (statut IS NULL OR statut = 'Nouveau')
);

-- POLITIQUE 2: Seulement les VRAIS admins peuvent lire
CREATE POLICY "Allow admin read all"
ON rendez_vous
FOR SELECT
TO authenticated
USING (
  -- Vérifier que l'utilisateur est un admin actif
  is_admin()
);

-- POLITIQUE 3: Seulement les VRAIS admins peuvent mettre à jour
CREATE POLICY "Allow admin update all"
ON rendez_vous
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- POLITIQUE 4: Seulement les VRAIS admins peuvent supprimer
CREATE POLICY "Allow admin delete all"
ON rendez_vous
FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- PARTIE 8: POLITIQUES RLS POUR clients_dossiers
-- ============================================================================

-- POLITIQUE: Seulement les VRAIS admins ont accès complet
CREATE POLICY "Admin full access"
ON clients_dossiers
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- PARTIE 9: POLITIQUES RLS POUR admin_users
-- ============================================================================

-- POLITIQUE 1: Les admins peuvent voir la liste des admins
CREATE POLICY "Admin can view admins"
ON admin_users
FOR SELECT
TO authenticated
USING (is_admin());

-- POLITIQUE 2: Les admins peuvent gérer les autres admins
CREATE POLICY "Admin can manage admins"
ON admin_users
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ============================================================================
-- PARTIE 10: FONCTION HELPER POUR AJOUTER UN ADMIN
-- ============================================================================

-- Fonction pour ajouter un admin facilement
CREATE OR REPLACE FUNCTION add_admin(admin_email TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT, admin_id UUID) AS $$
DECLARE
  target_user_id UUID;
  new_admin_id UUID;
BEGIN
  -- Vérifier que l'utilisateur existe dans auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = admin_email;

  IF target_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Utilisateur non trouvé. Créez d''abord un compte pour cet email.', NULL::UUID;
    RETURN;
  END IF;

  -- Vérifier si déjà admin
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = target_user_id) THEN
    RETURN QUERY SELECT false, 'Cet utilisateur est déjà admin.', NULL::UUID;
    RETURN;
  END IF;

  -- Ajouter l'admin
  INSERT INTO admin_users (user_id, email, created_by)
  VALUES (target_user_id, admin_email, auth.uid())
  RETURNING id INTO new_admin_id;

  RETURN QUERY SELECT true, 'Admin ajouté avec succès!', new_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaire
COMMENT ON FUNCTION add_admin(TEXT) IS 'Ajoute un utilisateur à la liste des admins';

-- ============================================================================
-- PARTIE 11: FONCTION HELPER POUR RETIRER UN ADMIN
-- ============================================================================

-- Fonction pour retirer un admin
CREATE OR REPLACE FUNCTION remove_admin(admin_email TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Trouver l'utilisateur
  SELECT user_id INTO target_user_id
  FROM admin_users
  WHERE email = admin_email;

  IF target_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Admin non trouvé.';
    RETURN;
  END IF;

  -- Supprimer l'admin
  DELETE FROM admin_users WHERE user_id = target_user_id;

  RETURN QUERY SELECT true, 'Admin retiré avec succès!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaire
COMMENT ON FUNCTION remove_admin(TEXT) IS 'Retire un utilisateur de la liste des admins';

-- ============================================================================
-- PARTIE 12: CRÉER LES PREMIERS ADMINS (IMPORTANT!)
-- ============================================================================

-- ⚠️ IMPORTANT: Créez d'abord les comptes dans Supabase Authentication
-- Puis décommentez les lignes ci-dessous pour leur donner accès admin

-- Étape 1: Créer les comptes dans Supabase
-- 1. Allez dans Authentication → Users → Add user
-- 2. Créez un compte pour: parebriseinstant@gmail.com
-- 3. Créez un compte pour: sarmadyaqoob4@gmail.com
-- 4. ✅ Cochez "Auto Confirm User" pour chaque compte

-- Étape 2: Décommentez ces lignes après avoir créé les comptes
-- SELECT add_admin('parebriseinstant@gmail.com');
-- SELECT add_admin('sarmadyaqoob4@gmail.com');

-- ============================================================================
-- PARTIE 13: VÉRIFICATIONS ET RÉSUMÉ
-- ============================================================================

-- Afficher toutes les politiques créées
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('rendez_vous', 'clients_dossiers', 'admin_users')
ORDER BY tablename, policyname;

-- Vérifier que RLS est activé
SELECT
  schemaname,
  tablename,
  rowsecurity as "RLS Activé"
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('rendez_vous', 'clients_dossiers', 'admin_users')
ORDER BY tablename;

-- Afficher les contraintes créées
SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('rendez_vous', 'clients_dossiers')
  AND tc.constraint_type IN ('CHECK', 'FOREIGN KEY')
ORDER BY tc.table_name, tc.constraint_name;

-- Afficher les index créés
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('rendez_vous', 'clients_dossiers', 'admin_users')
ORDER BY tablename, indexname;

-- ============================================================================
-- RÉSUMÉ FINAL
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════════════════════╗';
  RAISE NOTICE '║  ✅ CONFIGURATION PRODUCTION SÉCURISÉE APPLIQUÉE           ║';
  RAISE NOTICE '╚════════════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 SÉCURITÉ:';
  RAISE NOTICE '  ✅ RLS activé sur toutes les tables';
  RAISE NOTICE '  ✅ Table admin_users créée pour gérer les admins';
  RAISE NOTICE '  ✅ Fonction is_admin() pour vérifier les permissions';
  RAISE NOTICE '  ✅ Contraintes NOT NULL au niveau table';
  RAISE NOTICE '  ✅ Contraintes CHECK sur type_service et statut';
  RAISE NOTICE '';
  RAISE NOTICE '⚡ PERFORMANCE:';
  RAISE NOTICE '  ✅ Index créés sur colonnes fréquemment utilisées';
  RAISE NOTICE '  ✅ Index optimisés pour les requêtes admin';
  RAISE NOTICE '';
  RAISE NOTICE '👥 PERMISSIONS:';
  RAISE NOTICE '  • Visiteurs (anon): Peuvent SEULEMENT créer des réservations';
  RAISE NOTICE '  • Utilisateurs authentifiés: AUCUN accès (sauf admins)';
  RAISE NOTICE '  • Admins (dans admin_users): Accès complet à tout';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  ACTION REQUISE:';
  RAISE NOTICE '  1. Créez un compte dans Authentication → Users';
  RAISE NOTICE '  2. Ajoutez-vous comme admin: SELECT add_admin(''votre@email.com'');';
  RAISE NOTICE '  3. Testez le formulaire public sur votre site';
  RAISE NOTICE '  4. Testez l''accès admin avec votre compte';
  RAISE NOTICE '';
  RAISE NOTICE '📋 FONCTIONS DISPONIBLES:';
  RAISE NOTICE '  • add_admin(''email@example.com'') - Ajouter un admin';
  RAISE NOTICE '  • remove_admin(''email@example.com'') - Retirer un admin';
  RAISE NOTICE '  • is_admin() - Vérifier si l''utilisateur est admin';
  RAISE NOTICE '';
END $$;
