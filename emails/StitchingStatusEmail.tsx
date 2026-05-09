import { Html, Head, Preview, Body, Container, Section, Text, Hr, Link as ReactEmailLink } from '@react-email/components';
import * as React from 'react';

interface StitchingStatusProps {
  customerName: string;
  orderNumber: string;
  garmentName: string;
  status: 'cutting' | 'stitching' | 'quality_check' | 'ready';
}

export default function StitchingStatusEmail({
  customerName = 'Valued Customer',
  orderNumber = 'FB00000',
  garmentName = 'Custom Garment',
  status = 'cutting'
}: StitchingStatusProps) {

  const stages = ['cutting', 'stitching', 'quality_check', 'ready'];
  const currentIdx = stages.indexOf(status);

  const getStatusText = () => {
    switch(status) {
      case 'cutting': return "We've started cutting your fabric.";
      case 'stitching': return "Your garment is currently being stitched.";
      case 'quality_check': return "Your garment is in final quality check.";
      case 'ready': return "Your custom garment is ready for dispatch!";
      default: return "Your garment is being processed.";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Update on your custom stitching: {garmentName}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          <Section style={header}>
            <Text style={logo}>Fabloom</Text>
          </Section>

          <Section style={section}>
            <Text style={heading}>Stitching Update</Text>
            <Text style={text}>Hi {customerName},</Text>
            <Text style={text}>
              Great news! There is an update on your custom <strong>{garmentName}</strong> from order #{orderNumber}.
            </Text>
            <Text style={highlightText}>
              {getStatusText()}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Email Safe Timeline Table */}
          <Section style={timelineSection}>
            <table width="100%" border={0} cellSpacing="0" cellPadding="0">
              <tr>
                <td align="center" style={currentIdx >= 0 ? stepActive : stepInactive}>Cutting</td>
                <td align="center" style={currentIdx >= 1 ? stepActive : stepInactive}>Stitching</td>
                <td align="center" style={currentIdx >= 2 ? stepActive : stepInactive}>QC</td>
                <td align="center" style={currentIdx >= 3 ? stepActive : stepInactive}>Ready</td>
              </tr>
            </table>
            
            <div style={btnContainer}>
              <ReactEmailLink href={`https://fabloom.in/account/orders/${orderNumber}`} style={button}>
                Track Full Order
              </ReactEmailLink>
            </div>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>Questions? <ReactEmailLink href="https://wa.me/919999999999" style={link}>WhatsApp Support</ReactEmailLink></Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f9fafb', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '40px auto', padding: '0', borderRadius: '12px', border: '1px solid #f3f4f6', maxWidth: '600px' };
const header = { backgroundColor: '#0f1035', padding: '24px 40px', textAlign: 'center' as const };
const logo = { color: '#D4A853', fontSize: '24px', fontWeight: 'bold', margin: '0', fontFamily: 'Georgia, serif' };
const section = { padding: '32px 40px' };
const heading = { fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' };
const text = { fontSize: '15px', color: '#4b5563', lineHeight: '24px', margin: '0 0 16px 0' };
const highlightText = { fontSize: '18px', color: '#0f1035', fontWeight: 'bold', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center' as const };
const hr = { borderColor: '#e5e7eb', margin: '0' };
const timelineSection = { padding: '40px' };
const stepActive = { fontSize: '13px', fontWeight: 'bold', color: '#D4A853', padding: '10px 0', borderBottom: '3px solid #D4A853' };
const stepInactive = { fontSize: '13px', fontWeight: 'bold', color: '#d1d5db', padding: '10px 0', borderBottom: '3px solid #f3f4f6' };
const btnContainer = { textAlign: 'center' as const, marginTop: '32px' };
const button = { backgroundColor: '#0f1035', color: '#fff', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' };
const footer = { backgroundColor: '#f9fafb', padding: '24px', textAlign: 'center' as const, borderTop: '1px solid #e5e7eb' };
const footerText = { fontSize: '13px', color: '#6b7280', margin: '0' };
const link = { color: '#0f1035', textDecoration: 'underline', fontWeight: 'bold' };
