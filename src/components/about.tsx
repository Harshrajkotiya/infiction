import Book from "@/components/book";
import { Inter } from "@next/font/google";
import { useRef } from "react";


const roboto = Inter({
  weight: "400",
  subsets: ["latin"],
});

export default function about() {

  const htmlString:String = '<p><span style="display:flex;justify-content:center;">Hey there, welcome to InFiction! </span><br/><br/> We\'re a team of passionate storytellers who believe that great writing is the key to good films. That\'s why we\'ve created a platform that not only helps screenwriters hone their craft, but also connects them with industry professionals who are looking for the next big thing. <br /><br/>Our mission is to help writers from all backgrounds and walks of life, to share their stories and get the feedback they need to take their writing to the next level. We\'re huge fans of diversity, and we believe that the best stories come from all different perspectives and experiences.And we\'re not just any platform - we\'re powered by cutting-edge AI tools that give you unprecedented insights into the script.</p>';
  const htmlString1:String = 'But perhaps what makes us tick the most is the sense of community that we\'re building here. We\'re a group of like-minded individuals who are all dedicated to helping each you succeed in your filmmaking journey. <br /><br /> So, whether you\'re a seasoned pro or just starting out, we invite you to join our community. Let\'s make some amazing fiction together!';
  const divRefs = Array.from({ length: 4 }, () => useRef(null));

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Book title="About Us" content= {htmlString} content2= {htmlString1} length={4} divRefs={divRefs}/>
      </div>
    </>
  );
}
