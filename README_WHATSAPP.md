# WhatsApp Meta Cloud API Setup (Pending)

## When to activate
When you have a new SIM card not registered on a personal WhatsApp application.

## Steps

1. Go to [business.facebook.com](https://business.facebook.com) → Create Meta Business account.
2. Go to [developers.facebook.com](https://developers.facebook.com) → Create App → Business → Add WhatsApp product.
3. Register your new SIM number in the Meta dashboard (you will receive an OTP once).
4. Get the `PHONE_NUMBER_ID` and generate a permanent access token.
5. Submit message templates (e.g., `order_confirmation`, `stitching_started`) for Meta approval (usually takes 1-3 days).
6. Set environment variables: `META_WHATSAPP_TOKEN`, `META_PHONE_NUMBER_ID`.
7. Uncomment `lib/notifications/whatsapp.ts` and replace WATI calls with Meta Graph API calls.
8. Remove the stub exports in `whatsapp.ts`.

## After setup, is the SIM needed?
No daily use is needed. Keep the SIM with occasional recharges to stay active and avoid recycling by the carrier.

## Current Notification State
Fabloom currently uses an **Email-Only** notification system via [Resend](https://resend.com).
- **ENV VARS needed now:** `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`
- **ENV VARS to remove:** `WATI_API_ENDPOINT`, `WATI_API_TOKEN`
