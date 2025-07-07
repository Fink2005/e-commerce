'use client';
import ControllerIcon from '@/libs/shared/icons/Controller';
import HouseIcon from '@/libs/shared/icons/House';
import HumanIcon from '@/libs/shared/icons/Human';
import NotesIcon from '@/libs/shared/icons/Notes';
import QuestionIcon from '@/libs/shared/icons/Question';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabBar = [
  {
    icon: HouseIcon,
    title: 'Trang chủ',
    to: '/',
  },
  {
    icon: HumanIcon,
    title: 'Thần số học',
    to: '/numerology',
  },
  {
    icon: ControllerIcon,
    title: 'Đào vàng',
    to: '#',
  },
  {
    icon: NotesIcon,
    title: 'Bảng xếp hạng',
    to: '/ranking',
  },
  {
    icon: QuestionIcon,
    title: 'Nhiệm vụ',
    to: '#',
  },
];

export function Footer() {
  const pathName = usePathname();
  return (
    <footer
      className="absolute bottom-0 w-full flex "
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {
        tabBar.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.to} key={item.title} className={` flex-1 flex justify-center flex-col items-center space-y-2 ${pathName === item.to ? '' : 'opacity-50'}`}>
              <Icon />
              <span
                className="text-white font-[500] text-[0.5625rem]"
              >
                {item.title}
              </span>
            </Link>
          );
        })
      }
    </footer>
  );
}
