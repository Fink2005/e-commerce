'use client';
import { getCookie } from '@/app/actions/cookie';
import authRequests from '@/app/apis/requests/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cartStore';
import { Heart, LogOut, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Select getTotalItems to ensure re-render on cart changes
  const totalItems = useCartStore(state => state.getTotalItems());

  // Check for authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshToken = await getCookie('refresh_token');
        setIsAuthenticated(!!refreshToken);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await authRequests.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header
      className="w-full bg-white border-b border-gray-300 px-3 py-1 flex items-center justify-end gap-3 sticky top-0 z-10"
    >
      <Link href="/wishlist" prefetch={true}>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-red-500 transition-colors duration-200 cursor-pointer"
          aria-label="Favorites"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </Link>

      <Link href="/cart" prefetch={true}>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-blue-500 transition-colors duration-200 cursor-pointer relative"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -bottom-2 rounded-full -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </Link>

      {isAuthenticated && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="hover:text-gray-600 transition-colors duration-200 cursor-pointer"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      )}
    </header>
  );
};

export default Header;
