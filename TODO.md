# Code Debug & Fix Plan

## Task List

### Phase 1: Environment Validation

- [x] 1.1 Create `lib/env.ts` - Environment validation utility

### Phase 2: Fix Supabase Client

- [x] 2.1 Update `lib/supabaseClient.ts` - Safe initialization with validation

### Phase 3: Fix Resend Client

- [x] 3.1 Update `lib/resend.ts` - Add API key validation

### Phase 4: Fix API Route

- [x] 4.1 Update `app/api/booking/route.ts` - Use supabaseAdmin(), add env validation

### Phase 5: Fix Booking Form

- [x] 5.1 Update `components/BookingForm.tsx` - Remove unused import, fix message handling

### Phase 6: Verify Build

- [x] 6.1 Run build to verify all changes work

---

## Anomalies Fixed

### ✅ lib/supabaseClient.ts

- Added environment variable validation
- Added safe initialization with error handling
- Replaced `!` assertions with proper validation
- Added `isSupabaseConfigured()` helper function

### ✅ lib/resend.ts

- Added RESEND_API_KEY validation
- Added graceful fallback when API key is missing
- Added `isResendConfigured()` helper function
- Added null checks before sending emails

### ✅ app/api/booking/route.ts

- Now uses `supabaseAdmin()` instead of duplicate client
- Added environment validation at startup
- Better error handling for missing config
- Added GET endpoint for health checks
- Added better validation for service type and address

### ✅ components/BookingForm.tsx

- Removed unused `supabase` import
- Fixed message handling to send actual message content
- Added proper form validation with error messages
- Added optional message textarea field
- Fixed reset to also reset damageType

### ✅ lib/env.ts (NEW)

- Created environment validation utility
- Validates all required environment variables
- Checks URL format for Supabase URL
- Checks JWT token format for Supabase keys
- Logs warnings for invalid/missing env vars in development
