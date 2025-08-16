'use client';
import authRequests from '@/app/apis/requests/auth';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authRequests.logout();
      // Redirect to login page or home page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header
      className="w-full bg-white border-b border-gray-300 px-3 py-1 flex items-center justify-end gap-3 sticky top-0 z-10"
    >
      <Link
        href="/wishlist"
        prefetch={true}
      >
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-red-500 transition-colors duration-200 cursor-pointer"
          aria-label="Favorites"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </Link>

      <Link
        href="/cart"
        prefetch={true}
      >
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-blue-500 transition-colors duration-200 cursor-pointer"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="hover:text-gray-600 transition-colors duration-200 cursor-pointer"
        aria-label="Logout"
      >
        <LogOut className="w-5 h-5" />
      </Button>
    </header>
  );
};

export default Header;
