import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

const quickLinks = [
    { name: "Readymade", href: "/readymade" },
    { name: "Fabrics", href: "/fabrics" },
    { name: "Stitching", href: "/stitching" },
    { name: "Perfumes", href: "/perfumes" },
    { name: "Caps", href: "/caps" },
];

const helpLinks = [
    { name: "About Us", href: "/about" },
    { name: "Measure Guide", href: "/measure-guide" },
    { name: "Track Order", href: "/account/orders" },
    { name: "Contact Us", href: "https://wa.me/919544073317" },
];

export default function Footer() {
    return (
        <footer className="w-full" style={{ backgroundColor: '#0a0d26' }}>
            {/* Gold shimmer top accent */}
            <div
                className="w-full h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.4), #D4A853, rgba(212,168,83,0.4), transparent)' }}
            />
            <div className="flex flex-col gap-6 pt-8 pb-4 px-6 md:px-8 max-w-7xl mx-auto">
                {/* SECTION 1 — Brand block */}
                <div className="flex flex-col items-center text-center pb-6" style={{ borderBottom: '1px solid rgba(212,168,83,0.15)' }}>
                    <Image
                        src="/logo.jpeg"
                        alt="Fabloom Kandoras"
                        width={40}
                        height={40}
                        className="rounded-full mb-3"
                        style={{
                            border: '1.5px solid rgba(212,168,83,0.5)',
                            boxShadow: '0 0 20px rgba(212,168,83,0.2)',
                        }}
                    />
                    <h3 
                        className="text-2xl font-bold tracking-wide mb-1"
                        style={{ 
                            color: '#D4A853',
                            fontFamily: 'var(--font-playfair, serif)'
                        }}
                    >
                        Fabloom Kandoras
                    </h3>
                    <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Premium Islamic Fashion · Koduvally, Kerala
                    </p>

                    <div className="flex items-center gap-4">
                        <a href="https://www.instagram.com/fabloomkandoras/" target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110" style={{ border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853', boxShadow: '0 0 0 rgba(212,168,83,0)' }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 16px rgba(212,168,83,0.3)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(212,168,83,0.1)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 0 rgba(212,168,83,0)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'; }}>
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61584037474921" target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110" style={{ border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853' }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 16px rgba(212,168,83,0.3)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(212,168,83,0.1)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 0 rgba(212,168,83,0)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'; }}>
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="https://wa.me/919544073317" target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110" style={{ border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853' }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 16px rgba(212,168,83,0.3)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(212,168,83,0.1)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 0 rgba(212,168,83,0)'; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'; }}>
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.243 8.477 3.513 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.557-5.342 11.897-11.958 11.897-.002 0-.003 0-.005 0-2.099-.001-4.14-.547-5.945-1.588L0 24zm6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654zm11.167-10.964c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
                        </a>
                    </div>
                </div>

                {/* SECTION 2 — Two column grid */}
                <div className="grid grid-cols-2 gap-8 pb-6" style={{ borderBottom: '1px solid rgba(212,168,83,0.15)' }}>
                    <div>
                        <h4 className="text-sm font-bold mb-4" style={{ color: '#D4A853' }}>Quick Links</h4>
                        <ul className="flex flex-col gap-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm transition-colors hover:text-[#D4A853]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold mb-4" style={{ color: '#D4A853' }}>Help</h4>
                        <ul className="flex flex-col gap-3">
                            {helpLinks.map((link) => (
                                <li key={link.name}>
                                    {link.href.startsWith("http") ? (
                                        <a href={link.href} target="_blank" rel="noreferrer" className="text-sm transition-colors hover:text-[#D4A853]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                            {link.name}
                                        </a>
                                    ) : (
                                        <Link href={link.href} className="text-sm transition-colors hover:text-[#D4A853]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* SECTION 3 — Store info strip */}
                <div className="text-center pb-6">
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        📍 Koduvally, Kerala &nbsp;·&nbsp; 🕘 Open daily 9AM–9PM &nbsp;·&nbsp; 📞 +91 95440 73317
                    </p>
                </div>
            </div>

            {/* SECTION 4 — Copyright bar */}
            <div className="w-full py-4 text-center" style={{ backgroundColor: '#07091c' }}>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    © 2025 Fabloom Kandoras · All rights reserved
                </p>
            </div>
        </footer>
    );
}
