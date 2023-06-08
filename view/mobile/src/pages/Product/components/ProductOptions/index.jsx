import React, { useEffect } from 'react'
import { IMAGES, CONDIMENTS_LABEL } from '../../../../utilities/constants'
import { className, getLocalStorageItem, setLocalStorageItem } from '../../../../utilities/helpers'

const ProductOptions = ({ toast, condiments }) => {
    const addCondiment = condiment => {
        let selectedOptions   = getLocalStorageItem("options")

        const condimentBorder = document.getElementById('condiment-' + condiment.name)
        
        const pushCondiment   = condiment => selectedOptions.push(condiment)
        
        // Parse the selected condiments on product page
        if (selectedOptions) {
            // selectedOptions = JSON.parse(selectedOptions)
            let found = selectedOptions.filter(x => {
                return x.optionsTypeId === condiment.optionsTypeId
            })
            
            // Adds the condiment on the array and highlights the condiment
            if (found.length === 0) {
                pushCondiment(condiment)
                if (condiment.name === 'cheese') {
                    condimentBorder.classList.add('border-[13px]', 'border-[#b3322f]', 'bg-[#b3322f]') 
                    condimentBorder.classList.remove('bg-[#e8d9c5]')   
                } else {
                    condimentBorder.classList.add('border-[13px]', 'border-[#b3322f]')
                }
                condimentBorder.classList.remove('border-[#e8d9c5]')
                
                toast('Success', `${(condiment.name === 'cheese') ? 'Melty Cheese' : condiment.name.charAt(0).toUpperCase() + condiment.name.slice(1)} has been added.`)
                } else {
                const remainingCondiments = selectedOptions.filter(x => {
                    return x.optionsTypeId !== condiment.optionsTypeId
                })
                selectedOptions = remainingCondiments

                if (condiment.name === 'cheese') {
                    condimentBorder.classList.remove('border-[13px]', 'border-[#b3322f]', 'bg-[#e8d9c5]')
                    condimentBorder.classList.add('border-[#e8d9c5]', 'bg-[#e8d9c5]')
                } else {
                    condimentBorder.classList.remove('border-[8px]', 'border-[#b3322f]')
                    condimentBorder.classList.add('border-[#e8d9c5]')
                }
                    

                toast('Error', `${(condiment.name === 'cheese') ? 'Melty Cheese' : condiment.name.charAt(0).toUpperCase() + condiment.name.slice(1)} has been removed.`)
            }
        } else {
            selectedOptions = []
            pushCondiment(condiment)
            if (condiment.name === 'cheese') {
                condimentBorder.classList.remove('bg-[#e8d9c5]') 
                condimentBorder.classList.add('border-[13px]', 'border-[#b3322f]', 'bg-[#b3322f]')   
            } else {
                condimentBorder.classList.add('border-[13px]', 'border-[#b3322f]')
            }
            condimentBorder.classList.remove('border-[#e8d9c5]')

            toast('Success', `${(condiment.name === 'cheese') ? 'Melty Cheese' : condiment.name.charAt(0).toUpperCase() + condiment.name.slice(1)} has been added.`)
        }

        // Remove options storage item if there are no selected options and 
        // an existing options item is in the storage
        
        if (selectedOptions.length === 0 && getLocalStorageItem('options')) {
            localStorage.removeItem('options')
        } else {
            setLocalStorageItem('options', selectedOptions)
        }
    }


    const highlightSelectedOptions = () => {

        let selectedOptions = getLocalStorageItem("options")

        selectedOptions && Object.values(selectedOptions).map((condiment) => { 
            let condimentBorder = document.getElementById('condiment-' + condiment.name)
    
            if (condiment.name === 'cheese') {
                condimentBorder.classList.add('border-[13px]', 'border-[#b3322f]', 'bg-[#b3322f]') 
                condimentBorder.classList.remove('bg-[#e8d9c5]')   
            } else {
                condimentBorder.classList.add('border-[13px]', 'border-[#b3322f]')
            }
            condimentBorder.classList.remove('border-[#e8d9c5]')
            
        })
    }

    useEffect(() => {
        highlightSelectedOptions()
    }, [])

    return (
        <>
            <div className="flex flex-row justify-center gap-[14px] pt-[28px] px-10">
                {
                    Object.values(condiments).map(index => (
                        <div key={index.name} className="relative flex flex-col justify-start items-center" >
                            <div id={`condiment-` + index.name} key={`condiment-` + index.name} className={`rounded-full h-23 w-23 sm:w-[92px] sm:h-[92px] xs:w-[88px] xs:h-[88px] xxs:w-[70px] xxs:h-[70px] 3xs:h-[70px] 3xs:w-[70px] text-center relative border-[#e8d9c5] bg-[#e8d9c5] ${className(index.name === 'cheese') ? "border-[1px]" : "border-[13px]"}  `}>
                                <button 
                                    onClick     = {() => addCondiment(index)}
                                    aria-label = {`${index.name === 'cheese' ? 'melty cheese' : index.name} Sauce`}
                                    tabIndex    = {0}
                                >
                                    <div className={`${className(index.name === 'cheese') ? "sm:w-[100px] 3xs:w-[70px] xxs:w-[70px] xs:w-[90px] " : "sm:h-[67px] sm:w-[67px] 3xs:h-[67px] 3xs:w-[54px] xxs:h-[67px] xxs:w-[54px]"}`} aria-hidden = {true}>
                                        <img 
                                            className={`object-contain rounded-full ${className(index.name === 'cheese') ? 
                                                        "mt-[2px] sm:-ml-[5px] xs:-ml-[2px] xxs:-ml-[1px] 3xs:-ml-[1px]" : 
                                                        "h-[67px] w-[67px] sm:mt-[0px] sm:ml-[0px] xs:-mt-[3px] xxs:-mt-[11px] 3xs:mt-[-12px] 3xs:-ml-[5px] xxs:-ml-[5px] md:-mt-[3px]"} `} 
                                            src={IMAGES.CONDIMENTS[index.name]} 
                                            alt={IMAGES.CONDIMENTS[index.name]}
                                            aria-hidden = {true}
                                        /> 
                                    </div>
                                    <p className={`text-center text-robo-primaryTwo text-sm sm:text-sm xs:text-[13px] xxs:text-[12px] 3xs:text-[11px] w-full tracking-[1.12px] sm:leading-[15px] xs:leading-[15px] xxs:leading-[15px] md:leading-[15px] 3xs:leading-[15px] ${className(index.name === 'cheese') ? "-mt-[2px] -ml-[2px] xs:mt-[5px] xxs:mt-[5px] 3xs:mt-[3px]" : "mt-[20px]  mt-[20px] md:mt-[20px] sm:mt-[20px] xs:mt-[20px] xxs:mt-[9px] xxs:-ml-[4px] 3xs:-ml-[4px] 3xs:mt-[9px]"}`} aria-hidden = "true"> {CONDIMENTS_LABEL[index.name]} </p> 
                                </button>  
                            </div>
                        </div>
                    ))                
                }
            </div>
            
            <div className="flex flex-row justify-center gap-[14px] mt-[51px]">
                <div className="relative flex flex-col justify-start items-center">
                    <div id={`condiment-bbq`} className={`rounded-full border-[8px] h-23 w-23 sm:w-[92px] sm:w-[92px] xs:w-[88px] xs:h-[88px] xxs:w-[70px] xxs:h-[70px] 3xs:w-[70px] 3xs:h-[70px] text-center relative border-[#e8d9c5] bg-[#e8d9c5] `} key="bbq" tabIndex={0} aria-label  = "Barbeque Sauce - button disabled">
                        <button
                            className   = "disabled:opacity-50"
                            aria-hidden = {true}
                            disabled
                        >
                            <img 
                                className   = {`object-contain rounded-full h-[67px] w-[67px] sm:mt-[2px] xs:mt-[2px] xxs:mt-[-6px] 3xs:mt-[-8px] md:mt-[2px]`} 
                                src         = {IMAGES.CONDIMENTS['bbq']} 
                                alt         = "Barbeque Sauce Image" 
                                aria-hidden = {true}
                            />
                        <p className="text-center text-robo-primaryTwo sm:text-sm xs:text-[13px] xxs:text-[12px] 3xs:text-[11px] mx-0 mt-[20px] mt-[20px] md:mt-[20px] sm:mt-[22px] xs:mt-[22px] xxs:mt-[8px] 3xs:-ml-[4px] 3xs:mt-[10px] 3xs:ml-[1px] w-full tracking-[1.12px] sm:leading-[15px] xs:leading-[15px] xxs:leading-[15px] md:leading-[15px] 3xs:leading-[15px]" aria-hidden = {true}> BBQ </p>     
                        </button>       
                    </div>
                </div>

                <div className="relative flex flex-col justify-start items-center">
                    <div id={`condiment-relish`} className={`rounded-full border-[8px] h-23 w-23 sm:w-[92px] sm:w-[92px] xs:w-[88px] xs:h-[88px] xxs:w-[70px] xxs:h-[70px] 3xs:w-[70px] 3xs:h-[70px] text-center relative border-[#e8d9c5] bg-[#e8d9c5]`} key="relish" tabIndex={0} aria-label  = "Relish Sauce - button disabled">
                        <button
                            className  = "disabled:opacity-50" 
                            aria-hidden = {true} 
                            disabled  
                        >
                            <img 
                                className   = {`object-contain rounded-full h-[67px] w-[67px] sm:mt-[2px] xs:mt-[2px] xxs:mt-[-6px] 3xs:mt-[-8px] md:mt-[2px]`} 
                                src         = {IMAGES.CONDIMENTS['relish']}
                                alt         = "Relish Sauce Image"
                                aria-hidden = {true}
                            />  
                        <p className="text-center text-robo-primaryTwo sm:text-sm xs:text-[13px] xxs:text-[12px] 3xs:text-[11px] mx-0 mt-[20px]  mt-[20px] md:mt-[20px] sm:mt-[22px] xs:mt-[22px] xxs:mt-[8px] 3xs:-ml-[4px] 3xs:mt-[10px] 3xs:ml-[1px] w-full tracking-[1.12px] sm:leading-[15px] xs:leading-[15px] xxs:leading-[15px] md:leading-[15px] 3xs:leading-[15px]" aria-hidden = {true}> Relish </p>    
                        </button>        
                    </div>
                </div>

                <div className="relative flex flex-col justify-start items-center" >
                    <div id={`condiment-magic-sauce`} className={`rounded-full border-[8px] h-23 w-23 sm:w-[92px] sm:w-[92px] xs:w-[88px] xs:h-[88px] xxs:w-[70px] xxs:h-[70px] 3xs:w-[70px] 3xs:h-[70px] text-center relative border-[#e8d9c5] bg-[#e8d9c5]`} key="magic-sauce" tabIndex={0} aria-label  = "Robo Magic Sauce - button disabled">
                        <button
                            className  = "disabled:opacity-50" 
                            aria-hidden = {true}
                            disabled  
                        >
                            <img 
                                className   = {`object-contain rounded-full h-[67px] w-[67px] xxs:w-[67px] xxs:h-[54px] 3xs:w-[67px] 3xs:h-[54px] m:mt-[2px] xs:mt-[2px] xxs:-ml-[7px] 3xs:-ml-[6px] md:mt-[2px] xs:ml-[2px] ml-[4px] sm:mt-[1px]`} 
                                src         = {IMAGES.CONDIMENTS['robomagicsauce']} 
                                alt         = "Robo Magic Sauce Image"
                                aria-hidden = {true}
                            />   
                        <p className="text-center text-robo-primaryTwo sm:text-sm xs:text-[13px] xxs:text-[12px] 3xs:text-[11px] mx-0 mt-[20px]  mt-[20px] md:mt-[20px] sm:mt-[22px] sm:-ml-[10px] xs:mt-[22px] xs:-ml-[22px] xxs:mt-[15px] xxs:-ml-[11px] 3xs:-ml-[4px] 3xs:mt-[15px] 3xs:-ml-[11px] w-full tracking-[1.12px] sm:leading-[15px] xs:leading-[15px] xxs:leading-[15px] md:leading-[15px] sm:w-[100px] xs:w-[120px] xxs:w-[80px] 3xs:w-[80px] md:w-[120px] 3xs:leading-[15px]" aria-hidden = {true} > Robo Magic Sauce </p>          
                        </button> 
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductOptions