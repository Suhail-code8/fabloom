import { ImageResponse } from 'next/og';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';

export const runtime = 'nodejs';
export const alt = 'Fabloom Product';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();
    const product = await (Product as any).findOne({ slug }).lean();

    if (!product) {
        return new ImageResponse(
            (
                <div style={{ backgroundColor: '#0f1035', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1 style={{ color: '#D4A853', fontSize: 60 }}>Fabloom</h1>
                </div>
            ),
            { ...size }
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    backgroundColor: '#0f1035',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    border: '10px solid #D4A853',
                }}
            >
                <h1 style={{ color: '#D4A853', fontSize: 40, marginBottom: 20 }}>Fabloom</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '20px' }}>
                    <h2 style={{ color: 'white', fontSize: 60, textAlign: 'center', margin: 0 }}>{product.name}</h2>
                    <p style={{ color: '#D4A853', fontSize: 40, marginTop: 20 }}>₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                <div style={{ position: 'absolute', bottom: 40, color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>
                    Where tradition meets precision tailoring.
                </div>
            </div>
        ),
        { ...size }
    );
}
