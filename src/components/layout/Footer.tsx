import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const shopLinks = [
    { name: "Readymade Garments", href: "/readymade" },
    { name: "Premium Fabrics", href: "/fabrics" },
    { name: "Custom Stitching", href: "/stitching" },
    { name: "Accessories", href: "/accessories" },
];

const customerServiceLinks = [
    { name: "Track Order", href: "/account/orders" },
    { name: "Stitching Guide", href: "/stitching" },
    { name: "Size Chart", href: "/about" },
    { name: "Returns & Exchange", href: "/about" },
];

export default function Footer() {
    return (
        <footer className="bg-navy-800 text-cream border-t border-navy-700">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl font-bold text-gold-500">
                            Fabloom Kandoras
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Premium Islamic clothing. Quality fabrics,
                            readymade kandoras, and expert custom stitching services.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                className="text-gold-500 hover:text-gold-400 transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                className="text-gold-500 hover:text-gold-400 transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href="https://wa.me/919544073317"
                                target="_blank"
                                className="text-gold-500 hover:text-gold-400 transition-colors"
                            >
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.243 8.477 3.513 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.557-5.342 11.897-11.958 11.897-.002 0-.003 0-.005 0-2.099-.001-4.14-.547-5.945-1.588L0 24zm6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654zm11.167-10.964c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
                                <span className="sr-only">WhatsApp</span>
                            </Link>
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h4 className="font-semibold text-gold-500 mb-4">Shop</h4>
                        <ul className="space-y-2">
                            {shopLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-300 hover:text-gold-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service Column */}
                    <div>
                        <h4 className="font-semibold text-gold-500 mb-4">
                            Customer Service
                        </h4>
                        <ul className="space-y-2">
                            {customerServiceLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-300 hover:text-gold-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-semibold text-gold-500 mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <Phone className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-300">WhatsApp</p>
                                    <a
                                        href="https://wa.me/919544073317"
                                        target="_blank"
                                        className="text-sm text-gold-400 hover:text-gold-300"
                                    >
                                        +91 95440 73317
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Mail className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-300">Email</p>
                                    <a
                                        href="mailto:info@fabloom.com"
                                        className="text-sm text-gold-400 hover:text-gold-300"
                                    >
                                        info@fabloom.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-gray-300">Address</p>
                                    <p className="text-sm text-gray-400">
                                        Fabloom Kandoras Store,
                                        <br />
                                        Koduvally, Kerala, India
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-navy-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-gray-400">
                            © 2025 Fabloom Kandoras · Koduvally, Kerala
                        </p>
                        <div className="flex space-x-6">
                            <Link
                                href="/privacy"
                                className="text-sm text-gray-400 hover:text-gold-400 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-sm text-gray-400 hover:text-gold-400 transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
