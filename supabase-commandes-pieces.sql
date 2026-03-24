CREATE TABLE IF NOT EXISTS commandes_pieces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  garage_nom TEXT NOT NULL,
  garage_telephone TEXT NOT NULL,
  garage_email TEXT,
  garage_adresse TEXT NOT NULL,
  garage_ville TEXT NOT NULL DEFAULT 'Montreal',
  garage_province TEXT NOT NULL DEFAULT 'QC',
  garage_code_postal TEXT,
  vehicule_annee TEXT NOT NULL,
  vehicule_marque TEXT NOT NULL,
  vehicule_modele TEXT NOT NULL,
  vehicule_vin TEXT,
  pieces_demandees TEXT NOT NULL,
  pieces_numero_oem TEXT,
  quantite INTEGER DEFAULT 1,
  urgence TEXT NOT NULL DEFAULT 'urgent' CHECK (urgence IN ('critique', 'urgent', 'normal')),
  notes TEXT,
  statut TEXT NOT NULL DEFAULT 'Nouvelle' CHECK (statut IN ('Nouvelle', 'Confirmee', 'En route', 'Livree', 'Annulee')),
  prix_estime DECIMAL(10,2),
  temps_livraison_estime TEXT
);

CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON commandes_pieces (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes_pieces (statut);
CREATE INDEX IF NOT EXISTS idx_commandes_urgence ON commandes_pieces (urgence);
CREATE INDEX IF NOT EXISTS idx_commandes_garage_ville ON commandes_pieces (garage_ville);

ALTER TABLE commandes_pieces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert commande"
  ON commandes_pieces FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role full access"
  ON commandes_pieces FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
