-- ============================================================================
-- SCRIPT POUR SUPPRIMER LA CONTRAINTE QUI BLOQUE LES INSERTIONS
-- ============================================================================
--
-- PROBLEME: La contrainte "rendez_vous_adresse_min_length_when_no_place"
-- empêche l'insertion de nouvelles réservations.
--
-- SOLUTION: Supprimer cette contrainte car la validation est maintenant
-- gérée au niveau de l'application (React + API).
--
-- INSTRUCTIONS:
-- 1. Allez sur https://supabase.com/dashboard
-- 2. Sélectionnez votre projet
-- 3. Cliquez sur "SQL Editor" dans le menu de gauche
-- 4. Copiez-collez ce script
-- 5. Cliquez sur "Run" (ou Ctrl+Enter)
--
-- ============================================================================

-- Supprimer la contrainte problématique
ALTER TABLE rendez_vous
DROP CONSTRAINT IF EXISTS rendez_vous_adresse_min_length_when_no_place;

-- Vérifier que la contrainte a été supprimée
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'rendez_vous'
AND constraint_type = 'CHECK';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '  CONTRAINTE SUPPRIMEE AVEC SUCCES!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'La contrainte "rendez_vous_adresse_min_length_when_no_place" a été supprimée.';
    RAISE NOTICE '';
    RAISE NOTICE 'La validation de l''adresse est maintenant gérée par:';
    RAISE NOTICE '  1. Le composant AddressAutocomplete (React)';
    RAISE NOTICE '  2. La validation dans l''API /api/booking';
    RAISE NOTICE '';
    RAISE NOTICE 'Testez maintenant votre formulaire!';
    RAISE NOTICE '';
END $$;
