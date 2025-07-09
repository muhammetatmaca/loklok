import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useRef, useEffect, useState } from "react";

export default function MobileBottomNav() {
    const [, setLocation] = useLocation();
    const navRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    // Nav yüksekliğini ölç
    useEffect(() => {
        if (navRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                setHeight(navRef.current?.offsetHeight || 0);
            });

            resizeObserver.observe(navRef.current);

            // İlk yüklemede de ölç
            setHeight(navRef.current.offsetHeight || 0);

            return () => resizeObserver.disconnect();
        }
    }, []);

    const navItems = [
        {
            name: "Ana Sayfa",
            path: "/",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
            ),
        },
        {
            name: "Menü",
            path: "/menu",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h18m-9 0v9m-6-9v9m12-9v9" />
                    <path d="M3 5h18l-2 7H5L3 5z" />
                </svg>
            ),
        },
        {
            name: "Bilgi",
            path: "/about",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4m0-4h.01" />
                </svg>
            ),
        },
        {
            name: "Yorumlar",
            path: "/testimonials",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
            ),
        },
        {
            name: "İletişim",
            path: "/contact",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            ),
        },
        {
            name: "Admin",
            path: "/admin",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* İçeriğe nav kadar boşluk bırak */}
            <div style={{ height }} className="md:hidden" />

            {/* Mobil navigasyon */}
            <div ref={navRef} className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
                <div className="backdrop-blur-xl bg-zafer-surface/95 border-t border-white/10 shadow-2xl">
                    <div className="grid grid-cols-6 py-2">
                        {navItems.map((item, index) => (
                            <motion.button
                                key={item.name}
                                className="flex flex-col items-center py-3 px-1 text-zafer-text-muted hover:text-zafer-primary transition-colors duration-200"
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setLocation(item.path);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="mb-1">{item.icon}</div>
                                <span className="text-xs font-medium text-center leading-tight">{item.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
