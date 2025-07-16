import Image from 'next/image';

export default function CartItem({ item }) {
  return (
    <div className="flex items-center justify-between border rounded-md p-2 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="relative w-14 h-14">
          <Image
            src={item.image}
            alt={item.name}
            layout="fill"
            objectFit="contain"
            className="rounded"
          />
        </div>
        <div className="text-sm">{item.name}</div>
      </div>
      <div className="text-red-500 font-semibold text-sm">${item.price}</div>
    </div>
  );
}
