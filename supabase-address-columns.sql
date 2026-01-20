-- Script SQL pour ajouter les colonnes d'adresse détaillées à la table rendez_vous
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Ajouter les colonnes pour stocker les détails de l'adresse
ALTER TABLE rendez_vous
ADD COLUMN IF NOT EXISTS adresse_ville TEXT,
ADD COLUMN IF NOT EXISTS adresse_province TEXT,
ADD COLUMN IF NOT EXISTS adresse_code_postal TEXT,
ADD COLUMN IF NOT EXISTS adresse_latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS adresse_longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS adresse_place_id TEXT;

-- Ajouter un commentaire pour documenter les colonnes
COMMENT ON COLUMN rendez_vous.adresse_ville IS 'Ville extraite de Google Places (ex: Montréal)';
COMMENT ON COLUMN rendez_vous.adresse_province IS 'Province/État extrait de Google Places (ex: QC)';
COMMENT ON COLUMN rendez_vous.adresse_code_postal IS 'Code postal extrait de Google Places';
COMMENT ON COLUMN rendez_vous.adresse_latitude IS 'Latitude GPS pour géolocalisation';
COMMENT ON COLUMN rendez_vous.adresse_longitude IS 'Longitude GPS pour géolocalisation';
COMMENT ON COLUMN rendez_vous.adresse_place_id IS 'ID unique Google Places pour référence';

-- Créer un index pour les recherches géographiques (optionnel mais recommandé)
CREATE INDEX IF NOT EXISTS idx_rendez_vous_ville ON rendez_vous(adresse_ville);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_code_postal ON rendez_vous(adresse_code_postal);

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'rendez_vous'
AND column_name LIKE 'adresse_%'
ORDER BY ordinal_position;

<script type="module">
    import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

    const supabase = createClient(
    window.SUPABASE_URL || "YOUR_SUPABASE_URL",
    window.SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY"
    );

    async function updateAdresseIntegration(formattedAddress) {
    const { error } = await supabase
        .from('rendez_vous')
        .update({ adresse_integration: formattedAddress })
        .eq('adresse_intervention', 'rU-QYR761CnPJNpOTRuVj3oRXCk=');

    if (error) {
        console.error('Erreur update:', error);
        alert('Erreur lors de la mise à jour de l’adresse.');
    } else {
        console.log('Adresse intégrée mise à jour.');
    }
    }

  // Hook sur votre place-picker existant
    document.addEventListener('DOMContentLoaded', async () => {
    await customElements.whenDefined('gmp-map');
    const placePicker = document.querySelector('gmpx-place-picker');

    placePicker.addEventListener('gmpx-placechange', () => {
        const place = placePicker.value;
        if (!place?.location) return;

        const formatted = place.formattedAddress ?? place.displayName;
        updateAdresseIntegration(formatted);
    });
    });
</script>