import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

import { onAuthStateChanged, User } from "firebase/auth";
import { signInWithGoogle } from "@/lib/useGoogleLogin";

interface RezervasyonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RezervasyonModal({ isOpen, onClose }: RezervasyonModalProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    if (!isOpen) return null; // Modal kapalýysa hiç renderlama

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
            >
                {!user ? (
                    <>
                        <h2 className="text-xl font-semibold text-zafer-primary mb-4">Google ile Giriþ Yap</h2>
                        <button
                            onClick={async () => {
                                try {
                                    await signInWithGoogle();
                                } catch {
                                    alert("Giriþ baþarýsýz");
                                }
                            }}
                            className="w-full bg-zafer-primary text-white py-2 rounded mb-4 hover:bg-zafer-secondary transition"
                        >
                            Google ile Giriþ Yap
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
                        >
                            Ýptal
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold text-zafer-primary mb-4">Rezervasyon Yap</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                                const email = user.email || "";
                                const date = (form.elements.namedItem("date") as HTMLInputElement).value;
                                const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

                                const subject = encodeURIComponent(`Yeni Rezervasyon - ${name}`);
                                const body = encodeURIComponent(
                                    `Ad Soyad: ${name}\nEmail: ${email}\nTarih: ${date}\nMesaj: ${message}`
                                );

                                window.location.href = `mailto:muhammetatmaca79@gmail.com?subject=${subject}&body=${body}`;
                                onClose();
                            }}
                            className="space-y-4"
                        >
                            <input
                                name="name"
                                type="text"
                                placeholder="Adiniz Soyadiniz"
                                required
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-black"
                            />
                            <input
                                name="email"
                                type="email"
                                value={user.email || ""}
                                readOnly
                                    className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100 cursor-not-allowed text-black"
                            />
                            <input
                                name="date"
                                type="date"
                                required
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-black"
                            />
                            <textarea
                                name="message"
                                placeholder="Not / Mesaj"
                                rows={3}
                                    className="w-full border border-gray-300 rounded px-4 py-2 text-black"
                            />
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-zafer-primary text-white px-6 py-2 rounded hover:bg-zafer-secondary transition"
                                >
                                    Gonder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        signOut(auth);
                                    }}
                                    className="text-gray-500 hover:text-red-500 transition"
                                >
                                    Cikis Yap
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
}
