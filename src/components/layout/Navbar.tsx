"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

const navLinks = [
    { name: "Readymade", href: "/products" },
    { name: "Fabrics", href: "/fabrics" },
    { name: "Stitching", href: "/stitching" },
    { name: "About", href: "/about" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const { isSignedIn } = useUser();

    // Get cart count only on client side to avoid hydration errors
    useEffect(() => {
        setCartItemCount(useCartStore.getState().totalItems());

        // Subscribe to cart changes
        const unsubscribe = useCartStore.subscribe((state) => {
            setCartItemCount(state.totalItems());
        });

        return unsubscribe;
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Brand Logo */}
                    <Link href="/" className="flex items-center">
                        <h1 className="font-serif text-2xl font-bold text-gold-600 hover:text-gold-700 transition-colors">
                            Fabloom
                        </h1>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-navy-700 hover:text-emerald-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Search Icon */}
                        <Button variant="ghost" size="icon" className="hidden sm:flex">
                            <Search className="h-5 w-5 text-navy-700" />
                            <span className="sr-only">Search</span>
                        </Button>

                        {/* Auth: UserButton or Sign In */}
                        {isSignedIn ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm" className="text-navy-700 hover:text-emerald-600">
                                    Sign In
                                </Button>
                            </SignInButton>
                        )}

                        {/* Cart Icon with Badge */}
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5 text-navy-700" />
                                {cartItemCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {cartItemCount}
                                    </Badge>
                                )}
                                <span className="sr-only">Shopping Cart</span>
                            </Button>
                        </Link>

                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5 text-navy-700" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col space-y-4 mt-8">
                                    {/* Mobile Logo */}
                                    <Link
                                        href="/"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center mb-4"
                                    >
                                        <h2 className="font-serif text-2xl font-bold text-gold-600">
                                            Fabloom
                                        </h2>
                                    </Link>

                                    {/* Mobile Navigation Links */}
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-medium text-navy-700 hover:text-emerald-600 transition-colors py-2"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}

                                    {/* Mobile Auth */}
                                    <div className="pt-4 border-t">
                                        {isSignedIn ? (
                                            <div className="flex items-center gap-3 py-2">
                                                <UserButton afterSignOutUrl="/" />
                                                <span className="text-sm font-medium text-navy-700">My Account</span>
                                            </div>
                                        ) : (
                                            <SignInButton mode="modal">
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Sign In / Register
                                                </Button>
                                            </SignInButton>
                                        )}
                                    </div>

                                    {/* Mobile Search */}
                                    <div className="pt-2">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            Search Products
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
