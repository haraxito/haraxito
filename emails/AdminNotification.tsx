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
  Button,
  Link,
} from "@react-email/components";

interface AdminNotificationProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
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

export function AdminNotificationEmail({
  clientName,
  clientEmail,
  clientPhone,
  vehicleInfo,
  damageType,
  serviceType,
  address,
  preferredDate,
  message,
}: AdminNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Nouvelle demande de {clientName} -{" "}
        {serviceType === "DOMICILE" ? "Domicile" : "Atelier"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>🔔 Nouvelle Demande !</Heading>
            <Text style={headerSubtitle}>
              Un nouveau client attend votre réponse
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Client Info Alert */}
            <Section style={clientAlert}>
              <Heading as="h3" style={clientAlertTitle}>
                👤 Informations Client
              </Heading>
              <Text style={clientAlertText}>
                <strong>Nom :</strong> {clientName}
              </Text>
              <Text style={clientAlertText}>
                <strong>Email :</strong>{" "}
                <Link href={`mailto:${clientEmail}`} style={link}>
                  {clientEmail}
                </Link>
              </Text>
              <Text style={clientAlertText}>
                <strong>Téléphone :</strong>{" "}
                <Link href={`tel:${clientPhone}`} style={link}>
                  {clientPhone}
                </Link>
              </Text>
            </Section>

            {/* Service Details */}
            <Section style={detailsCard}>
              <Heading as="h3" style={detailsTitle}>
                🚗 Détails de l&apos;intervention
              </Heading>
              <Hr style={divider} />

              <table style={detailsTable}>
                <tbody>
                  <tr style={tableRow}>
                    <td style={labelCell}>Véhicule</td>
                    <td style={valueCell}>{vehicleInfo}</td>
                  </tr>
                  <tr style={tableRow}>
                    <td style={labelCell}>Dommage</td>
                    <td style={valueCell}>{formatDamageType(damageType)}</td>
                  </tr>
                  <tr style={tableRow}>
                    <td style={labelCell}>Service</td>
                    <td style={valueCell}>
                      <span
                        style={{
                          ...badge,
                          backgroundColor:
                            serviceType === "DOMICILE" ? "#10b981" : "#1957b3",
                        }}
                      >
                        {serviceType === "DOMICILE"
                          ? "🏠 DOMICILE"
                          : "🔧 ATELIER"}
                      </span>
                    </td>
                  </tr>
                  {address && (
                    <tr style={tableRow}>
                      <td style={labelCell}>📍 Adresse</td>
                      <td style={valueCell}>{address}</td>
                    </tr>
                  )}
                  {preferredDate && (
                    <tr style={tableRow}>
                      <td style={labelCell}>📅 Date souhaitée</td>
                      <td style={valueCell}>{preferredDate}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {message && (
                <>
                  <Hr style={divider} />
                  <Text style={messageLabel}>💬 Message du client :</Text>
                  <Text style={messageBox}>{message}</Text>
                </>
              )}
            </Section>

            {/* CTA */}
            <Section style={ctaSection}>
              <Button href={`tel:${clientPhone}`} style={ctaButton}>
                📞 Appeler le client
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Email automatique - AutoGlass Pro Admin Panel
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminNotificationEmail;

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
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  padding: "30px 40px",
  textAlign: "center" as const,
  borderRadius: "16px 16px 0 0",
};

const headerTitle: React.CSSProperties = {
  color: "#ffffff",
  margin: "0",
  fontSize: "24px",
  fontWeight: "700",
};

const headerSubtitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.9)",
  margin: "10px 0 0 0",
  fontSize: "14px",
};

const content: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "40px",
};

const clientAlert: React.CSSProperties = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  padding: "15px 20px",
  marginBottom: "25px",
  borderRadius: "0 8px 8px 0",
};

const clientAlertTitle: React.CSSProperties = {
  color: "#92400e",
  margin: "0 0 10px 0",
  fontSize: "16px",
};

const clientAlertText: React.CSSProperties = {
  margin: "5px 0",
  color: "#78350f",
  fontSize: "14px",
};

const link: React.CSSProperties = {
  color: "#1957b3",
  textDecoration: "none",
};

const detailsCard: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "25px",
  marginBottom: "25px",
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

const tableRow: React.CSSProperties = {
  borderBottom: "1px solid #e2e8f0",
};

const labelCell: React.CSSProperties = {
  color: "#718096",
  fontSize: "14px",
  padding: "10px 0",
  width: "35%",
  verticalAlign: "middle",
};

const valueCell: React.CSSProperties = {
  color: "#2d3748",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 0",
  verticalAlign: "middle",
};

const badge: React.CSSProperties = {
  color: "white",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
  display: "inline-block",
};

const messageLabel: React.CSSProperties = {
  color: "#718096",
  fontSize: "14px",
  margin: "0 0 8px 0",
};

const messageBox: React.CSSProperties = {
  color: "#2d3748",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  margin: "0",
  border: "1px solid #e2e8f0",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center" as const,
};

const ctaButton: React.CSSProperties = {
  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  color: "#ffffff",
  padding: "15px 40px",
  borderRadius: "30px",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
};

const footer: React.CSSProperties = {
  backgroundColor: "#1e293b",
  padding: "25px 40px",
  textAlign: "center" as const,
  borderRadius: "0 0 16px 16px",
};

const footerText: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "12px",
  margin: "0",
};
