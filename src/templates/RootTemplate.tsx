import React from 'react';

const
  RootTemplate = (props: {
    children: React.ReactNode;
  }) => {
    return (
      <main className="flex flex-col items-center bg-white">
        <div className="w-full relative sm:max-w-[450px] sm:border-x border-dashed border-black">
          {props.children}
        </div>
      </main>
    );
  };

export default RootTemplate;
