import styles from "@/styles/screen1.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Screen2 from "./screen2";
import Layout from "@/components/layout";


export default function Screen1() {
  const [showLogo, setShowLogo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const myDivRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // console.log("Scrolled");

      function setLoading() {
        setIsLoading(true);
      }

      if ((window.scrollY > 0)) {
        setShowAnimation(true);
        setShowLogo(true);
        setTimeout(setLoading, 1500);
      } else if (window.scrollY === 0) {
        setShowLogo(false);
        setShowAnimation(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className={styles.main}>
       {/* <Layout> */}
        <div className={styles.BgImg}
        ref={myDivRef}
        >
        <Image
          
          src="/InFiction Logo White.png"
          className={` ${showLogo ? styles.logo_stick : styles.WhiteLogo}`}
          alt={"InFiction White Logo"}
          width={100}
          height={100}
        />
        <div>{showLogo && isLoading && <Screen2 />}</div>
      </div>
      {/* </Layout> */}

    </main>
  );
}
