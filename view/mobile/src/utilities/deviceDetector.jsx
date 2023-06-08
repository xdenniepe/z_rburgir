import React from 'react'
import { isMobile } from 'react-device-detect'

const DeviceDetector = () => {
    if (isMobile) {
        console.log('Running in Mobile')
    } else {
        console.log('Running in Desktop')
    }

    return (<></>)
}

export default DeviceDetector

// import { BrowserView, MobileView } from "react-device-detect"

// const DeviceDetector = () => (
//   <>
//     <BrowserView>I am rendered on: Desktop</BrowserView>
//     <MobileView>I am rendered on: Mobile</MobileView>
//   </>
// )

// export default DeviceDetector