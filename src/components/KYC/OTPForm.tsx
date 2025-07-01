'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const OTPForm = () => {
  const [otp, setOtp] = useState<string[]>(Array.from({ length: 6 }).fill('') as string[]);
  const [count, setCount] = useState<{
    isCounting: boolean;
    timeLeft: number;
  }>({
    isCounting: false,
    timeLeft: 60,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleResend = () => {
    if (intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev.timeLeft <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return { isCounting: false, timeLeft: 60 };
        }
        return { isCounting: true, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (otp.includes('')) {
      toast.warning('Vui lòng nhập đầy đủ mã OTP.');
      return;
    }

    router.push('verified');
  };

  return (
    <div className="flex flex-col items-center">
      <p
        className="text-[0.875rem] text-center font-[274] text-[#FAFAFA] mt-4"
        style={{ textShadow: '0px 4px 15px rgba(145, 213, 255, 0.50)' }}
      >
        Mã xác nhận đã được gửi đến email
      </p>
      <p className="text-[#BAE7FF] text-[0.875rem] font-[590] text-center">
        phans@gmail.com
      </p>
      <div className="flex gap-3 my-5 justify-center">
        {otp.map((digit, index) => (
          <Input
          // eslint-disable-next-line react/no-array-index-key
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="number"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleInputChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className="w-[3.1563rem] h-[4rem] text-center text-2xl font-bold bg-white text-black rounded-2xl"
          />
        ))}

      </div>
      <div className="space-x-1">
        <span className="text-[#FFF] text-[0.875rem] font-[274]" style={{ textShadow: '0px 4px 15px rgba(145, 213, 255, 0.50)' }}>Chưa có mã xác nhận?</span>
        {count.isCounting ? (
          <span className="text-[0.875rem] text-[#BAE7FF] font-[590]">
            {count.timeLeft}
            s
          </span>
        ) : (
          <button
            type="button"
            className="text-[0.875rem] text-[#BAE7FF] font-[590] underline decoration-solid decoration-skip-ink-0 cursor-pointer bg-transparent border-none p-0"
            onClick={handleResend}
          >
            Gửi lại
          </button>
        )}
      </div>
      <Button className="button-base w-[21.4375rem] mt-3" onClick={handleSubmit}>Xác nhận</Button>
    </div>
  );
};

export default OTPForm;
