/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Pblack:["Black"],
        Pbold:['Bold'],
        Plight:['Light'],
        PextraBold:['ExtraBold'],
        PextraLight:['ExtraLight'],
        Pthin:['Thin'],
        PsemiBold:['SemiBold'],
        Pregular:['Regular'],
        Pmedium:['Medium'],
      },
    },
  },
  plugins: [],
};
