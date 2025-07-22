import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header
      className="w-full bg-white border-b border-gray-300 px-3 py-1 flex items-center justify-end gap-3 sticky top-0 z-10"
    >
      <Link href="/wishlist">
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-red-500 transition-colors duration-200 cursor-pointer"
          aria-label="Favorites"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </Link>
      <Link href="/cart">
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-blue-500 transition-colors duration-200 cursor-pointer"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </Link>
    </header>
  );
};

export default Header;
