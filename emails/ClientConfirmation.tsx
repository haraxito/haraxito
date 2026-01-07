import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components";

interface ClientConfirmationProps {
  clientName: string;
  vehicleInfo: string;
  damageType: string;
  serviceType: "DOMICILE" | "ATELIER";
  address?: string;
  preferredDate?: string;
  message?: string;
}

const formatDamageType = (type: string): string => {
  const types: Record<string, string> = {
    crack: "Fissure",
    chip: "Éclat / Impact",
    shattered: "Pare-brise brisé",
    other: "Autre",
  };
  return types[type] || type;
};

const formatServiceType = (type: "DOMICILE" | "ATELIER"): string => {
  return type === "DOMICILE" ? "Service Mobile (À Domicile)" : "En Atelier";
};

export function ClientConfirmationEmail({
  clientName,
  vehicleInfo,
  damageType,
  serviceType,
  address,
  preferredDate,
  message,
}: ClientConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirmation de votre demande - AutoGlass Pro</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>🚗 AutoGlass Pro</Heading>
            <Text style={headerSubtitle}>
              Service de remplacement de pare-brise
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading as="h2" style={title}>
              ✅ Demande reçue !
            </Heading>
            <Text style={paragraph}>
              Bonjour <strong>{clientName}</strong>,
            </Text>
            <Text style={paragraph}>
              Nous avons bien reçu votre demande de rendez-vous. Notre équipe
              vous contactera dans les plus brefs délais pour confirmer votre
              intervention.
            </Text>

            {/* Booking Details */}
            <Section style={detailsCard}>
              <Heading as="h3" style={detailsTitle}>
                📋 Récapitulatif de votre demande
              </Heading>
              <Hr style={divider} />

              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={labelCell}>Véhicule :</td>
                    <td style={valueCell}>{vehicleInfo}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Type de dommage :</td>
                    <td style={valueCell}>{formatDamageType(damageType)}</td>
                  </tr>
                  <tr>
                    <td style={labelCell}>Type de service :</td>
                    <td style={valueCell}>
                      <span
                        style={{
                          ...badge,
                          backgroundColor:
                            serviceType === "DOMICILE" ? "#10b981" : "#1957b3",
                        }}
                      >
                        {formatServiceType(serviceType)}
                      </span>
                    </td>
                  </tr>
                  {address && (
                    <tr>
                      <td style={labelCell}>Adresse :</td>
                      <td style={valueCell}>{address}</td>
                    </tr>
                  )}
                  {preferredDate && (
                    <tr>
                      <td style={labelCell}>Date souhaitée :</td>
                      <td style={valueCell}>{preferredDate}</td>
                    </tr>
                  )}
                  {message && (
                    <tr>
                      <td style={labelCell}>Message :</td>
                      <td style={valueCell}>{message}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {/* Next Steps */}
            <Section style={nextSteps}>
              <Heading as="h3" style={nextStepsTitle}>
                📞 Prochaine étape
              </Heading>
              <Text style={nextStepsText}>
                Un de nos conseillers vous appellera sous 24h pour confirmer le
                rendez-vous et vous fournir un devis précis.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>AutoGlass Pro</strong> - Service professionnel de
              remplacement de pare-brise
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} AutoGlass Pro. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ClientConfirmationEmail;

// Styles
const main: React.CSSProperties = {
  backgroundColor: "#f4f7fa",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const header: React.CSSProperties = {
  background: "linear-gradient(135deg, #1957b3 0%, #0d3a7a 100%)",
  padding: "40px",
  textAlign: "center" as const,
  borderRadius: "16px 16px 0 0",
};

const headerTitle: React.CSSProperties = {
  color: "#ffffff",
  margin: "0",
  fontSize: "28px",
  fontWeight: "700",
};

const headerSubtitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.9)",
  margin: "10px 0 0 0",
  fontSize: "16px",
};

const content: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "40px",
};

const title: React.CSSProperties = {
  color: "#1957b3",
  margin: "0 0 20px 0",
  fontSize: "24px",
};

const paragraph: React.CSSProperties = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 15px 0",
};

const detailsCard: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "25px",
  marginTop: "30px",
  marginBottom: "30px",
};

const detailsTitle: React.CSSProperties = {
  color: "#1957b3",
  margin: "0 0 15px 0",
  fontSize: "18px",
};

const divider: React.CSSProperties = {
  borderColor: "#e2e8f0",
  margin: "15px 0",
};

const detailsTable: React.CSSProperties = {
  width: "100%",
};

const labelCell: React.CSSProperties = {
  color: "#718096",
  fontSize: "14px",
  padding: "8px 0",
  width: "40%",
  verticalAlign: "top",
};

const valueCell: React.CSSProperties = {
  color: "#2d3748",
  fontSize: "14px",
  fontWeight: "600",
  padding: "8px 0",
};

const badge: React.CSSProperties = {
  color: "white",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  display: "inline-block",
};

const nextSteps: React.CSSProperties = {
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  borderRadius: "12px",
  padding: "25px",
  textAlign: "center" as const,
};

const nextStepsTitle: React.CSSProperties = {
  color: "#ffffff",
  margin: "0 0 10px 0",
  fontSize: "18px",
};

const nextStepsText: React.CSSProperties = {
  color: "rgba(255,255,255,0.95)",
  margin: "0",
  fontSize: "14px",
  lineHeight: "1.6",
};

const footer: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  padding: "30px 40px",
  textAlign: "center" as const,
  borderTop: "1px solid #e2e8f0",
  borderRadius: "0 0 16px 16px",
};

const footerText: React.CSSProperties = {
  color: "#718096",
  fontSize: "14px",
  margin: "0 0 10px 0",
};

const footerCopyright: React.CSSProperties = {
  color: "#a0aec0",
  fontSize: "12px",
  margin: "0",
};
