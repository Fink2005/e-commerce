import { inter } from '@/app/fonts/inter';
import { poppins } from '@/app/fonts/poppins';
import React from 'react';

const
  RootTemplate = (props: {
    children: React.ReactNode;
  }) => {
    return (
      <main className={`flex flex-col items-center ${inter.variable} ${poppins.variable}`}>
        <div className="w-full relative sm:max-w-[450px] sm:border-x border-dashed border-black">
          {props.children}
        </div>
      </main>
    );
  };

export default RootTemplate;
