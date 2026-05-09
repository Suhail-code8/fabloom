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

interface StitchingStartedEmailProps {
  orderNumber: string;
  customerName: string;
  garmentType: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL : '';

export const StitchingStartedEmail = ({
  orderNumber = 'FB000000',
  customerName = 'Valued Customer',
  garmentType = 'Custom Garment',
}: StitchingStartedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>We've started stitching your {garmentType}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>FABLOOM</Text>
            <Text style={tagline}>PREMIUM TAILORING</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={heading}>Great news, {customerName}!</Text>
            
            <Text style={paragraph}>
              Our master tailors have begun working on your <strong>{garmentType}</strong>. We'll make sure every detail matches your provided measurements.
            </Text>
            
            <Section style={orderNumberSection}>
              <Text style={orderNumberText}>Order: {orderNumber}</Text>
            </Section>

            <Hr style={hr} />

            <Text style={subheading}>Current Status: Stitching</Text>
            
            <table style={{ width: '100%', margin: '20px 0', textAlign: 'center', fontSize: '14px' }}>
              <tbody>
                <tr>
                  <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>Received ✓</td>
                  <td style={{ color: '#bbb' }}>—</td>
                  <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>Cutting ✓</td>
                  <td style={{ color: '#bbb' }}>—</td>
                  <td style={{ color: '#D4A853', fontWeight: 'bold', fontSize: '16px' }}>Stitching ←</td>
                  <td style={{ color: '#bbb' }}>—</td>
                  <td style={{ color: '#999' }}>QC</td>
                  <td style={{ color: '#bbb' }}>—</td>
                  <td style={{ color: '#999' }}>Ready</td>
                </tr>
              </tbody>
            </table>

            <Text style={paragraph}>
              We'll notify you as soon as it passes our quality check and is ready for dispatch!
            </Text>

            <Section style={btnContainer}>
              <Button style={button} href={`${baseUrl}/account/orders/${orderNumber}`}>
                Track Your Order
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

export default StitchingStartedEmail;

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px' };
const headerSection = { backgroundColor: '#0f1035', padding: '30px 20px', textAlign: 'center' as const };
const logo = { color: '#D4A853', fontSize: '32px', fontFamily: 'Georgia, serif', fontWeight: 'bold', letterSpacing: '2px', margin: '0' };
const tagline = { color: '#ffffff', fontSize: '10px', letterSpacing: '4px', margin: '5px 0 0 0' };
const contentSection = { padding: '30px 40px' };
const heading = { fontSize: '24px', fontWeight: 'bold', color: '#333' };
const paragraph = { fontSize: '16px', lineHeight: '26px', color: '#555' };
const orderNumberSection = { backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '4px', textAlign: 'center' as const, margin: '20px 0' };
const orderNumberText = { fontSize: '18px', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '2px', margin: '0', color: '#0f1035' };
const subheading = { fontSize: '18px', fontWeight: 'bold', color: '#333', marginTop: '20px', textAlign: 'center' as const };
const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const btnContainer = { textAlign: 'center' as const, marginTop: '30px' };
const button = { backgroundColor: '#0f1035', borderRadius: '4px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'block', width: '100%', padding: '16px 0' };
const footer = { textAlign: 'center' as const, padding: '0 40px' };
const footerText = { fontSize: '12px', color: '#8898aa', lineHeight: '20px' };
const footerCopyright = { fontSize: '10px', color: '#8898aa', marginTop: '20px' };
