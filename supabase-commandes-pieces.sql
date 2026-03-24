-- Table commandes_pieces pour PièceFlash MTL
-- Livraison d'urgence de pièces auto pour garagistes - Grand Montréal

-- Supprimer l'ancienne table si besoin (décommenter si migration)
-- DROP TABLE IF EXISTS rendez_vous;

CREATE TABLE IF NOT EXISTS commandes_pieces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Infos garage
  garage_nom TEXT NOT NULL,
  garage_telephone TEXT NOT NULL,
  garage_email TEXT,
  garage_adresse TEXT NOT NULL,
  garage_ville TEXT NOT NULL DEFAULT 'Montréal',
  garage_province TEXT NOT NULL DEFAULT 'QC',
  garage_code_postal TEXT,

  -- Infos véhicule du client
  vehicule_annee TEXT NOT NULL,
  vehicule_marque TEXT NOT NULL,
  vehicule_modele TEXT NOT NULL,
  vehicule_vin TEXT,

  -- Pièces demandées (saisie manuelle)
  pieces_demandees TEXT NOT NULL,  -- Description libre des pièces
  pieces_numero_oem TEXT,          -- Numéro OEM/pièce si connu
  quantite INTEGER DEFAULT 1,

  -- Niveau d'urgence
  urgence TEXT NOT NULL DEFAULT 'normal' CHECK (urgence IN ('critique', 'urgent', 'normal')),

  -- Notes additionnelles
  notes TEXT,

  -- Statut de la commande
  statut TEXT NOT NULL DEFAULT 'Nouvelle' CHECK (statut IN ('Nouvelle', 'Confirmée', 'En route', 'Livrée', 'Annulée')),

  -- Métadonnées
  prix_estime DECIMAL(10,2),
  temps_livraison_estime TEXT
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON commandes_pieces (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes_pieces (statut);
CREATE INDEX IF NOT EXISTS idx_commandes_urgence ON commandes_pieces (urgence);
CREATE INDEX IF NOT EXISTS idx_commandes_garage_ville ON commandes_pieces (garage_ville);

-- Row Level Security
ALTER TABLE commandes_pieces ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde peut insérer (formulaire public)
CREATE POLICY "Public peut créer une commande"
  ON commandes_pieces FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique: service role a accès complet (API admin)
CREATE POLICY "Service role accès complet"
  ON commandes_pieces FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
