
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function useAuth(requireAuth = true) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (requireAuth && !currentUser) {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [requireAuth, router]);

    const signOut = async () => {
        try {
            await auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return { user, loading, signOut };
}
