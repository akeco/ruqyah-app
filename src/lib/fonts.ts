import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";

export const headingFont = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

export const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const fontClassNames = `${headingFont.variable} ${bodyFont.variable}`;
