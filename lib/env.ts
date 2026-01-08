// Environment validation utility
// Run validation once at module load time

export type EnvVar = {
  key: string;
  required: boolean;
  value?: string;
};

const requiredEnvVars: EnvVar[] = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", required: true },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true },
  { key: "SUPABASE_SERVICE_ROLE_KEY", required: true },
  { key: "RESEND_API_KEY", required: true },
  { key: "ADMIN_EMAIL", required: false },
  { key: "RESEND_FROM_EMAIL", required: false },
];

export interface EnvValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

let cachedResult: EnvValidationResult | null = null;

export function validateEnvVars(): EnvValidationResult {
  if (cachedResult) {
    return cachedResult;
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.key];

    if (envVar.required && !value) {
      errors.push(`❌ Missing required env var: ${envVar.key}`);
    } else if (envVar.required && value) {
      // Validate URL format for Supabase
      if (envVar.key === "NEXT_PUBLIC_SUPABASE_URL") {
        try {
          new URL(value);
        } catch {
          errors.push(`❌ Invalid URL format for ${envVar.key}`);
        }
      }
      // Validate key format for Supabase
      if (
        envVar.key === "NEXT_PUBLIC_SUPABASE_ANON_KEY" ||
        envVar.key === "SUPABASE_SERVICE_ROLE_KEY"
      ) {
        if (!value.startsWith("eyJ") || value.length < 50) {
          errors.push(
            `❌ Invalid format for ${envVar.key} (should be a JWT token)`
          );
        }
      }
      // Basic check for Resend API key
      if (envVar.key === "RESEND_API_KEY" && !value.startsWith("re_")) {
        warnings.push(
          `⚠️ RESEND_API_KEY may be invalid (should start with 're_')`
        );
      }
    } else if (!envVar.required && !value) {
      warnings.push(`ℹ️ Optional env var not set: ${envVar.key}`);
    }
  }

  cachedResult = {
    valid: errors.length === 0,
    errors,
    warnings,
  };

  return cachedResult;
}

export function getEnvVar(
  key: string,
  defaultValue?: string
): string | undefined {
  const value = process.env[key];
  if (value === undefined || value === "") {
    return defaultValue;
  }
  return value;
}

// Call validation at module load (will log to console in development)
if (process.env.NODE_ENV === "development") {
  const result = validateEnvVars();
  if (result.errors.length > 0) {
    console.error("🚨 Environment Variable Errors:", result.errors);
  }
  if (result.warnings.length > 0) {
    console.warn("⚠️ Environment Variable Warnings:", result.warnings);
  }
  if (result.valid) {
    console.log("✅ All required environment variables are configured");
  }
}
