import React from 'react'
import styles from "../styles/404.module.css";
import { useRouter } from 'next/router';

export default function Error403() {
    const router = useRouter();

    return (
        <>
            <div className={styles.bg_purple}>
                <div className={styles.stars}>
                    <div className="custom_navbar">
                        <div className={styles.brand_logo}>
                            <img src="../InFiction Logo White.png" alt="logo" width="80px" />
                        </div>
                    </div>
                    <div className={styles.central_body}>
                        <img className={styles.image_404} src="../403.svg" alt="403"width="300px" />
                        <button onClick={() => router.push("/")} className={`btn btn-outline ${styles.btn_go_home}`} >GO BACK HOME</button>
                    </div>
                    <div className={styles.objects}>
                        <img className={styles.object_rocket} alt="rocket" src="http://salehriaz.com/404Page/img/rocket.svg" width="40px" />
                        <div className={styles.earth_moon}>
                            <img className={styles.object_earth} alt="earth" src="http://salehriaz.com/404Page/img/earth.svg" width="100px" />
                            <img className={styles.object_moon} alt="moon" src="http://salehriaz.com/404Page/img/moon.svg" width="80px" />
                        </div>
                        <div className={styles.box_astronaut}>
                            <img className={styles.object_astronaut} alt="astronaut" src="http://salehriaz.com/404Page/img/astronaut.svg" width="140px" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
