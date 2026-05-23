// src/pages/products.tsx
import { CONFIG } from 'src/config-global';
import { ProductsView } from 'src/sections/product/view';
import { useEffect, useState } from 'react';
import { auth } from 'src/lib/firebase';

// ----------------------------------------------------------------------

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log('✅ User UID:', user.uid);
      setUserId(user.uid);
    } else {
      console.log('❌ No user authenticated');
    }
  }, []);

  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>
      <ProductsView userId={userId} />
    </>
  );
}
