import React from "react";
import Tittle from "./Tittle";
import StartReadingButton from "./StartReadingButton";

const Write = () => {
  // const handleClick = () => {
  //   router.push("/ourwrittings");
  // };

  return (
    <div
      className="h-screen bg-cover bg-amber-300 bg-center relative"
      // style={{ backgroundImage: "url('/your-image.jpg')" }} // 🔁 Replace with your image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-60 z-0"></div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-black px-4">
        <div className=" mb-6">
          <Tittle text1="Explore" text2="Top Blogs" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center drop-shadow-lg">
          Best Blogs in the World
        </h1>
        <h2 className="text-2xl sm:text-3xl font-medium text-center drop-shadow-md">
          Enjoy the Interesting Stories and Arts
        </h2>

        {/* Stylish Line */}
        <div className="mt-6 w-60 h-[3px] bg-white animate-pulse rounded-full shadow-lg" />
        <StartReadingButton />
      </div>
    </div>
  );
};

export default Write;
