-- ============================================================================
-- SCRIPT DE CORRECTION - TABLE rendez_vous
-- ============================================================================
--
-- PROBLEME: L'API /api/booking retourne une erreur 500 car les colonnes
-- d'adresse n'existent pas dans la table Supabase.
--
-- SOLUTION: Exécutez ce script dans Supabase SQL Editor
--
-- COMMENT FAIRE:
-- 1. Allez sur https://supabase.com/dashboard
-- 2. Sélectionnez votre projet
-- 3. Cliquez sur "SQL Editor" dans le menu de gauche
-- 4. Copiez-collez tout ce script
-- 5. Cliquez sur "Run" (ou Ctrl+Enter)
--
-- ============================================================================

-- ============================================================================
-- PARTIE 1: CRÉER LA TABLE SI ELLE N'EXISTE PAS
-- ============================================================================

CREATE TABLE IF NOT EXISTS rendez_vous (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Informations client
    client_nom TEXT NOT NULL,
    client_email TEXT,
    client_telephone TEXT NOT NULL,

    -- Informations véhicule
    vehicule_infos TEXT NOT NULL,

    -- Type de service
    type_service TEXT NOT NULL CHECK (type_service IN ('DOMICILE', 'ATELIER')),

    -- Adresse principale (texte complet)
    adresse_intervention TEXT,

    -- Date et statut
    date_souhaitee DATE NOT NULL,
    statut TEXT DEFAULT 'Nouveau' CHECK (statut IN ('Nouveau', 'Confirmé', 'En cours', 'Terminé', 'Annulé')),

    -- Message optionnel
    message TEXT
);

-- ============================================================================
-- PARTIE 2: AJOUTER LES COLONNES D'ADRESSE DETAILLEES (SI MANQUANTES)
-- ============================================================================

-- Colonne pour la ville (ex: Montréal)
ALTER TABLE rendez_vous
ADD COLUMN IF NOT EXISTS adresse_ville TEXT;

-- Colonne pour la province (ex: QC)
ALTER TABLE rendez_vous
ADD COLUMN IF NOT EXISTS adresse_province TEXT;

-- Colonne pour le code postal (ex: H2X 1Y4)
ALTER TABLE rendez_vous
ADD COLUMN IF NOT EXISTS adresse_code_postal TEXT;

-- Colonne pour la latitude GPS
ALTER TABLE rendez_vous
ADD COLUMN IF NOT EXISTS adresse_latitude DOUBLE PRECISION;

-- Colonne pour la longitude GPS
ALTER TABLE rendez_vous
ADD COLUMN IF NOT EXISTS adresse_longitude DOUBLE PRECISION;

-- Colonne pour l'ID Google Places
ALTER TABLE rendez_vous
ADD COLUMN IF NOT EXISTS adresse_place_id TEXT;

-- ============================================================================
-- PARTIE 3: AJOUTER LES INDEX POUR LA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_rendez_vous_created_at ON rendez_vous(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_statut ON rendez_vous(statut);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_date_souhaitee ON rendez_vous(date_souhaitee);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_ville ON rendez_vous(adresse_ville);

-- ============================================================================
-- PARTIE 4: CONFIGURER RLS (Row Level Security)
-- ============================================================================

-- Activer RLS
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;

-- Supprimer l'ancienne politique si elle existe
DROP POLICY IF EXISTS "Allow public insert for booking form" ON rendez_vous;

-- Créer la politique pour permettre les insertions publiques (formulaire)
CREATE POLICY "Allow public insert for booking form"
ON rendez_vous
FOR INSERT
TO anon
WITH CHECK (
    client_nom IS NOT NULL
    AND client_telephone IS NOT NULL
    AND vehicule_infos IS NOT NULL
    AND type_service IN ('DOMICILE', 'ATELIER')
    AND date_souhaitee IS NOT NULL
    AND (statut IS NULL OR statut = 'Nouveau')
);

-- Politique pour permettre au service role de tout faire (API backend)
DROP POLICY IF EXISTS "Service role full access" ON rendez_vous;
CREATE POLICY "Service role full access"
ON rendez_vous
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- PARTIE 5: VÉRIFICATION
-- ============================================================================

-- Afficher la structure de la table pour vérifier
SELECT
    column_name AS "Colonne",
    data_type AS "Type",
    is_nullable AS "Nullable",
    column_default AS "Valeur par défaut"
FROM information_schema.columns
WHERE table_name = 'rendez_vous'
ORDER BY ordinal_position;

-- ============================================================================
-- RÉSUMÉ
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '  SCRIPT EXECUTE AVEC SUCCES!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Colonnes ajoutées:';
    RAISE NOTICE '  - adresse_ville';
    RAISE NOTICE '  - adresse_province';
    RAISE NOTICE '  - adresse_code_postal';
    RAISE NOTICE '  - adresse_latitude';
    RAISE NOTICE '  - adresse_longitude';
    RAISE NOTICE '  - adresse_place_id';
    RAISE NOTICE '';
    RAISE NOTICE 'Votre formulaire devrait maintenant fonctionner!';
    RAISE NOTICE 'Testez en soumettant une nouvelle réservation.';
    RAISE NOTICE '';
END $$;
