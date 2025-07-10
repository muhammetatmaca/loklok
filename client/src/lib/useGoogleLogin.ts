// client/src/lib/useGoogleLogin.ts

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Giriş Başarılı:", user);
        return user;
    } catch (error) {
        console.error("Giriş Hatası:", error);
        throw error;
    }
};
