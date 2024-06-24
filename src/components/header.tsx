import Image from "next/image";
import styles from "@/styles/screen1.module.css";

export default function Header({ imgSrc }) {
   var imageSrc =  imgSrc;
   return( <Image

        src={imageSrc}
        className={` ${styles.logo_stick}`}
        alt={"InFiction White Logo"}
        width={100}
        height={100}
    />);
}