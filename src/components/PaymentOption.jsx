import Image from 'next/image';

export default function PaymentOptions({ selected, onChange }) {
  return (
    <div className="space-y-2 text-sm">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="payment"
            value="bank"
            checked={selected === 'bank'}
            onChange={e => onChange(e.target.value)}
          />
          <span>Bank</span>
          <span className="flex space-x-2 items-center">
            <Image className="ml-4" src="/assets/visa.webp" alt="Visa" width={24} height={16} />
            <Image className="ml-4" src="/assets/mastercard.webp" alt="MasterCard" width={24} height={16} />
          </span>
        </label>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={selected === 'cod'}
            onChange={e => onChange(e.target.value)}
          />
          <span>Cash on delivery</span>
        </label>
      </div>
    </div>
  );
}
