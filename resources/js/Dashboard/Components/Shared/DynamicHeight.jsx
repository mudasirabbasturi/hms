// import { useState, useEffect } from "react"
// const useDynamicHeight = () => {
//     const [dynamicHeight, setDynamicHeight] = useState("100vh")
//     useEffect(() => {
//         const calculateHeight = () => {
//             const headerTop = document.querySelector(".header-top")
//             const bodyHeader = document.querySelector(".bodyHeader")
//             if (headerTop && bodyHeader) {
//                 const headerTopHeight = headerTop.getBoundingClientRect().height
//                 const bodyHeaderHeight = bodyHeader.getBoundingClientRect().height
//                 const totalHeight = headerTopHeight + bodyHeaderHeight
//                 setDynamicHeight(`calc(100vh - ${totalHeight}px)`)
//             }
//         }
//         calculateHeight()
//         window.addEventListener("resize", calculateHeight)
//         return () => {
//             window.removeEventListener("resize", calculateHeight)
//         }
//     }, [])
//     return dynamicHeight
// }
// export default useDynamicHeight

import { useState, useEffect } from "react"
const useDynamicHeight = () => {
    const [dynamicHeight, setDynamicHeight] = useState("100vh")
    useEffect(() => {
        const calculateHeight = () => {
            const headerTop = document.querySelector(".header-top")
            const bodyHeader = document.querySelector(".bodyHeader")
            if (headerTop && bodyHeader) {
                const headerTopStyles = window.getComputedStyle(headerTop);
                const bodyHeaderStyles = window.getComputedStyle(bodyHeader)
                const headerTopHeight = headerTop.getBoundingClientRect().height +
                    parseFloat(headerTopStyles.marginTop) +
                    parseFloat(headerTopStyles.marginBottom)
                const bodyHeaderHeight = bodyHeader.getBoundingClientRect().height +
                    parseFloat(bodyHeaderStyles.marginTop) +
                    parseFloat(bodyHeaderStyles.marginBottom)
                const totalHeight = headerTopHeight + bodyHeaderHeight
                setDynamicHeight(`calc(100vh - ${totalHeight}px)`)
            }
        }
        calculateHeight()
        window.addEventListener("resize", calculateHeight)
        return () => {
            window.removeEventListener("resize", calculateHeight);
        }
    }, [])
    return dynamicHeight;
}
export default useDynamicHeight