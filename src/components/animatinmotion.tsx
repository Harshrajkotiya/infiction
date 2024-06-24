import styles from "@/styles/screen1.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Screen2 from "./screen2";
import { delay, motion } from "framer-motion"

const parent = {
    variantA: { scale: 1 },
    variantB: { scale: 1 },
};

const child = {
    variantA: { bottom: 0, right: 0, height: 400, width: 400, rotate: 0 },
    variantB: { top: 0, left: 0, height: 100, width: 100, rotate: 0 }
};

const childtext = {
    variantA: { display: "none" },
    variantB: { display: "block", bottom: 100, right: 100, }
};

export default function Screen1() {
    return (
        <motion.div
            style={{
                width: 1000,
                height: 1000,
                zIndex: 3,
                borderRadius: 30,
                backgroundColor: "rgba(200,200,200)",
                position: "relative"
            }}

            variants={parent}
            initial="variantA"
            whileHover="variantB"
        >
            <motion.img
                src="/InFiction Logo White.png"
                style={{
                    width: 400,
                    height: 400,
                    zIndex: 3,

                    position: "absolute",
                    bottom: 0,
                    right: 0
                }}
                variants={child}
                transition={{
                    duration: 1,
                }}

            />
            <motion.p
                style={{
                    padding: 20,
                    position: "absolute",
                    bottom: 0,
                    right: 0,

                }}
                variants={childtext}
                transition={{
                    damping: 10,

                    duration: 1,
                    delay: 1

                }}
            >
                Welcome to InFiction, the ultimate destination for every
                filmmaker's dream! Get ready to embark on a journey that will take
                you to the pinnacle of cinematic excellence. Here, we offer a
                plethora of services that cater to all your filmmaking needs, be
                it screenplay writing, evaluations and rating, audience reactions
                or production requirements. <br />
                <br /> But that's not all, for we go beyond the ordinary and bring
                to you India's first-of-its-kind searchable screenplay marketplace
                that hosts a diverse array of voices from all across the globe.
                Our film ecosystem is designed to cater to makers and creators of
                every kind, ensuring that each one of you finds exactly what
                you're looking for. <br />
                <br /> Step into the world of InFiction and experience the thrill
                of being a part of something extraordinary. Lose yourself in the
                maze of film trivia and contests, or hunt for that elusive, highly
                niche writer or story for your OTT platform. At InFiction, we are
                not just building a website, we are building a legacy, a space
                where creativity and innovation collide to create something truly
                magical. So, come along and join us on this journey where your
                wildest dreams become a reality. InFiction, your one-stop-shop for
                everything films!
            </motion.p>

        </motion.div>
    );
}