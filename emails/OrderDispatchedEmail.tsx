import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderDispatchedEmailProps {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  courierName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL : '';

export const OrderDispatchedEmail = ({
  orderNumber = 'FB000000',
  customerName = 'Valued Customer',
  trackingNumber = 'TRK123456789',
  courierName = 'Standard Shipping',
}: OrderDispatchedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Fabloom order is on its way!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>FABLOOM</Text>
            <Text style={tagline}>PREMIUM TAILORING</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={heading}>It's on the way, {customerName}!</Text>
            
            <Text style={paragraph}>
              Great news! Your order <strong>{orderNumber}</strong> has been handed over to our delivery partner and is currently making its way to you.
            </Text>
            
            <Section style={trackingSection}>
              <Text style={subheading}>Tracking Information</Text>
              <Text style={paragraph}>Courier: <strong>{courierName}</strong></Text>
              <Text style={trackingNumberText}>{trackingNumber}</Text>
              <Text style={{ ...paragraph, fontSize: '12px', color: '#8898aa', marginTop: '10px' }}>
                You can copy the tracking number above to check the status on the courier's website.
              </Text>
            </Section>

            <Hr style={hr} />

            <Section style={btnContainer}>
              <Button style={button} href={`${baseUrl}/account/orders/${orderNumber}`}>
                View Order Details
              </Button>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Need help? Contact our support team via WhatsApp:<br/>
              <strong>+91 98765 43210</strong>
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} Fabloom. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderDispatchedEmail;

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px' };
const headerSection = { backgroundColor: '#0f1035', padding: '30px 20px', textAlign: 'center' as const };
const logo = { color: '#D4A853', fontSize: '32px', fontFamily: 'Georgia, serif', fontWeight: 'bold', letterSpacing: '2px', margin: '0' };
const tagline = { color: '#ffffff', fontSize: '10px', letterSpacing: '4px', margin: '5px 0 0 0' };
const contentSection = { padding: '30px 40px' };
const heading = { fontSize: '24px', fontWeight: 'bold', color: '#333' };
const paragraph = { fontSize: '16px', lineHeight: '26px', color: '#555' };
const trackingSection = { backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '4px', textAlign: 'center' as const, margin: '20px 0' };
const trackingNumberText = { fontSize: '24px', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '2px', margin: '10px 0', color: '#0f1035', padding: '10px', border: '2px dashed #ccc', borderRadius: '4px', display: 'inline-block' };
const subheading = { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '0 0 10px 0', textAlign: 'center' as const };
const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const btnContainer = { textAlign: 'center' as const, marginTop: '30px' };
const button = { backgroundColor: '#0f1035', borderRadius: '4px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'block', width: '100%', padding: '16px 0' };
const footer = { textAlign: 'center' as const, padding: '0 40px' };
const footerText = { fontSize: '12px', color: '#8898aa', lineHeight: '20px' };
const footerCopyright = { fontSize: '10px', color: '#8898aa', marginTop: '20px' };
