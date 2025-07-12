'use client';

import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.push('/login');
        }

        try {
            fetch('https://backend.handex.edu.az/api/auth/verify-token', {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.statusCode == 401) {
                        router.push('/login')
                    }
                })

        } catch (error:any) {
            console.log(error.data.message)
        }
    }, [pathname]);

    return <>{children}</>;
}
