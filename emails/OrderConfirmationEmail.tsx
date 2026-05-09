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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: any[];
  total: number;
  deliveryAddress: any;
  estimatedDelivery: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL : '';

export const OrderConfirmationEmail = ({
  orderNumber = 'FB000000',
  customerName = 'Valued Customer',
  items = [],
  total = 0,
  deliveryAddress = {},
  estimatedDelivery = 'TBD',
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Fabloom Order Confirmation - {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>FABLOOM</Text>
            <Text style={tagline}>PREMIUM TAILORING</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={heading}>Thank you for your order, {customerName}!</Text>
            
            <Text style={paragraph}>
              We've received your order and are currently processing it. Here is your order number:
            </Text>
            
            <Section style={orderNumberSection}>
              <Text style={orderNumberText}>{orderNumber}</Text>
            </Section>

            <Hr style={hr} />

            <Text style={subheading}>Order Summary</Text>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th style={tableHeader}>Item</th>
                  <th style={tableHeaderQty}>Qty/Meters</th>
                  <th style={tableHeaderPrice}>Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e6ebf1' }}>
                    <td style={tableCell}>
                      <Text style={itemName}>{item.productName}</Text>
                      {item.itemType === 'fabric' && item.stitchingDetails && (
                        <Text style={itemDetails}>
                          Stitching: {item.stitchingDetails.specialInstructions?.split('|')[0] || 'Custom Garment'}<br/>
                          <span style={{ color: '#D4A853' }}>Measurements saved ✓</span>
                        </Text>
                      )}
                    </td>
                    <td style={tableCellQty}>
                      {item.itemType === 'readymade' || item.itemType === 'accessory' ? item.quantity : `${item.meters}m`}
                    </td>
                    <td style={tableCellPrice}>₹{(item.totalPrice + (item.stitchingDetails?.stitchingPrice || 0)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Section style={{ textAlign: 'right' }}>
              <Text style={totalText}>Total Amount: <span style={{ fontWeight: 'bold' }}>₹{total.toLocaleString('en-IN')}</span></Text>
            </Section>

            <Hr style={hr} />

            <Row>
              <Column>
                <Text style={subheading}>Delivery Address</Text>
                <Text style={addressText}>
                  {deliveryAddress.fullName}<br />
                  {deliveryAddress.address}<br />
                  {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.postalCode}<br />
                  {deliveryAddress.country}<br />
                  Phone: {deliveryAddress.phone}
                </Text>
              </Column>
              <Column>
                <Text style={subheading}>Estimated Delivery</Text>
                <Text style={addressText}>{estimatedDelivery}</Text>
              </Column>
            </Row>

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

export default OrderConfirmationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const headerSection = {
  backgroundColor: '#0f1035',
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#D4A853',
  fontSize: '32px',
  fontFamily: 'Georgia, serif',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0',
};

const tagline = {
  color: '#ffffff',
  fontSize: '10px',
  letterSpacing: '4px',
  margin: '5px 0 0 0',
};

const contentSection = {
  padding: '30px 40px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555',
};

const orderNumberSection = {
  backgroundColor: '#f4f4f4',
  padding: '15px',
  borderRadius: '4px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const orderNumberText = {
  fontSize: '24px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  letterSpacing: '4px',
  margin: '0',
  color: '#0f1035',
};

const subheading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  marginTop: '20px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const tableHeader = { textAlign: 'left' as const, padding: '10px', borderBottom: '2px solid #e6ebf1', color: '#555' };
const tableHeaderQty = { textAlign: 'center' as const, padding: '10px', borderBottom: '2px solid #e6ebf1', color: '#555' };
const tableHeaderPrice = { textAlign: 'right' as const, padding: '10px', borderBottom: '2px solid #e6ebf1', color: '#555' };

const tableCell = { padding: '10px 0' };
const tableCellQty = { padding: '10px 0', textAlign: 'center' as const };
const tableCellPrice = { padding: '10px 0', textAlign: 'right' as const };

const itemName = { margin: 0, fontWeight: 'bold', color: '#333' };
const itemDetails = { margin: '4px 0 0 0', fontSize: '12px', color: '#777' };

const totalText = { fontSize: '18px', color: '#333' };

const addressText = {
  fontSize: '14px',
  color: '#555',
  lineHeight: '22px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '30px',
};

const button = {
  backgroundColor: '#0f1035',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '16px 0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '0 40px',
};

const footerText = {
  fontSize: '12px',
  color: '#8898aa',
  lineHeight: '20px',
};

const footerCopyright = {
  fontSize: '10px',
  color: '#8898aa',
  marginTop: '20px',
};
