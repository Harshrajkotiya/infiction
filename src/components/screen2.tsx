import styles from "@/styles/screen1.module.css";
import { useRef, useState } from "react";
import styles1 from "../styles/arrow.module.css";
import Screen3 from "../pages/WhoAreYou";

export default function Screen2() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const myDivRef = useRef(null);
  const pauseAnimation = useRef(null);

  function scrolledToBottom(e) {
    setIsLoading(true);
  }

  function scrolled(e) {
    const myDiv = myDivRef.current;
    if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
      scrolledToBottom(e);
    }
  }

  function ChangeToScreen3() {
    setIsLoading(false);
  }

  return (
    <>

      <div
        className={styles.scroll_text_p}
        ref={myDivRef}
        onScroll={scrolled}
        style={{ height: "100px", overflowY: "scroll" }}
      >
        <div ref={pauseAnimation} className={styles.scrolled_div}>
          <p>
            Welcome to InFiction, the ultimate destination for every
            filmmaker's dream! Get ready to embark on a journey that will
            take you to the pinnacle of cinematic excellence. Here, we offer
            a plethora of services that cater to all your filmmaking needs,
            be it screenplay writing, evaluations and rating, audience
            reactions or production requirements. <br />
            <br /> But that's not all, for we go beyond the ordinary and
            bring to you India's first-of-its-kind searchable screenplay
            marketplace that hosts a diverse array of voices from all across
            the globe. Our film ecosystem is designed to cater to makers and
            creators of every kind, ensuring that each one of you finds
            exactly what you're looking for. <br />
            <br /> Step into the world of InFiction and experience the
            thrill of being a part of something extraordinary. Lose yourself
            in the maze of film trivia and contests, or hunt for that
            elusive, highly niche writer or story for your OTT platform. At
            InFiction, we are not just building a website, we are building a
            legacy, a space where creativity and innovation collide to
            create something truly magical. So, come along and join us on
            this journey where your wildest dreams become a reality.
            InFiction, your one-stop-shop for everything films!
          </p>
        </div>
      </div>

      <a href="/WhoAreYou" className={styles1.arrow}>
        <img
          id={styles1.scroll_icon}
          src="/arrow.svg"
          alt="down arrow"
        ></img>
      </a>
    </>

  );
}
