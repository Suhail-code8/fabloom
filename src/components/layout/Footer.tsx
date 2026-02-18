import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const shopLinks = [
    { name: "Readymade Garments", href: "/products" },
    { name: "Premium Fabrics", href: "/fabrics" },
    { name: "Custom Stitching", href: "/stitching" },
    { name: "Accessories", href: "/products?category=accessories" },
];

const customerServiceLinks = [
    { name: "Track Order", href: "/orders" },
    { name: "Stitching Guide", href: "/stitching-guide" },
    { name: "Size Chart", href: "/size-chart" },
    { name: "Returns & Exchange", href: "/returns" },
];

export default function Footer() {
    return (
        <footer className="bg-navy-800 text-cream border-t border-navy-700">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl font-bold text-gold-500">
                            Fabloom
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Premium Islamic clothing for scholars and kids. Quality fabrics,
                            readymade garments, and expert custom stitching services.
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
                                        href="https://wa.me/1234567890"
                                        target="_blank"
                                        className="text-sm text-gold-400 hover:text-gold-300"
                                    >
                                        +1 (234) 567-890
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
                                        123 Islamic Center St,
                                        <br />
                                        City, State 12345
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
                            © {new Date().getFullYear()} Fabloom. All rights reserved.
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
