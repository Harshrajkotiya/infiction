import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";
import { useState } from "react";
import Layout from "../../components/layout";
import styles from "../../styles/arrow.module.css";
import style1 from "../../styles/marketplace.module.css";
import { useRouter } from "next/router";

export default function Screen4() {
    const router  = useRouter();
    
  return (
    <>
      {/* <Layout> */}
        <Header imgSrc="/InFiction Logo White.png"/>
          <div className={style1.screen4Div}>
            <Image
              src="../marketplace.png"
              className={style1.marketplace}
              alt="Market Place"
              width={100}
              height={100}
            />
            
            <a href="/WhoAreYou"  className={styles.Screen4_arrow}>
              <img
                id={styles.scroll_icon}
                src="/arrow.svg"
                alt="down arrow"></img>
            </a>
          </div>
          <Footer component={router.query["component"]} open={router.query["open"]}/>
      {/* </Layout> */}
    </>
  );
}
