import React, { memo } from 'react'
import QRCode from 'react-qr-code'

const QRItem = ({ code, active }) => (
    <div className={`h-full w-full ${!active && 'inactive-qr'} bg-[#ebe8e3`}>
        <div className="qr-codes">
            <QRCode 
                className="h-[180px] w-[180px] sm:h-[190px] sm:w-[190px] xs:h-[170px] xs:w-[170px] xxs:h-[160px]  xxs:w-[160px] 3xs:h-[150px]  3xs:w-[150px]"
                aria-label = "QR Code - QR Code Generated" 
                role       = "img" 
                style      = {
                                {
                                    margin         : 'auto',
                                    border         : 'solid',
                                    borderColor    : 'black',
                                    borderRadius   : 10,
                                    borderWidth    : 8,
                                    padding        : 15,
                                    backgroundColor: 'white'
                                }
                            }
                tabIndex   = {0} 
                value      = {code} 
                viewBox    = {`0 0 256 256`}
            />
        </div>
    </div>
)

export default memo(QRItem)
