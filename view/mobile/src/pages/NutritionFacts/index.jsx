import React, { useContext, useEffect, useState } from 'react'
import { getLocalStorageItem, mutateIngredientsToString } from '../../utilities/helpers'
import { GET, POST } from '../../utilities/constants'
import { ChevronLeft } from '../../utilities/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { request } from '../../services/request'
import ProductContext from '../../contexts/productContext'
import api from '../../services/api'

const NutritionFacts = ({ toast, renderSr, setHasLoaded}) => {
    const navigate       = useNavigate()
    const [searchParams] = useSearchParams()
    const productState   = useContext(ProductContext)?.state
    const options        = getLocalStorageItem('options')

    const [product, setProduct]                             = useState([{}])
    const [condimentLoading, setCondimentLoading]           = useState(true)
    const [mainIngredientLoading, setMainIngredientLoading] = useState(true)
    const [mainIngredients, setMainIngredients]             = useState([])
    const [condimentIngredients, setCondimentIngredients]   = useState([])
    const [nutritionFacts, setNutritionFacts]               = useState([])

    const getProducts = (id) => {
        request({
            url: `${api.PRODUCTS}/findById`,
            method: GET,
            params: {
                productId : id
            }
        }).then((response) => {
            setProduct(response.data)
            getMainIngredients()
            getCondimentIngredients(response.data)
            getNutritionFacts(response.data)
            setCondimentLoading(false)
        }).catch(() => {
            toast('Error', 'Network error, please try again later.')
        })
    }

    const getMainIngredients = () => {
        request({
            url    : api.PRODUCTS_MAIN_INGREDIENTS,
            method : GET
        }).then((response) =>{
            setMainIngredients(response.data)
            setMainIngredientLoading(false)
        })
    }   

    const getCondimentIngredients = (product) => {
        request({
            url    : api.CONDIMENTS_INGREDIENTS,
            method : POST,
            data   : product.name !== 'standard' && options === undefined ? [] : product.name !== 'standard' && options !== undefined ? options : productState?.condiments,
            params : { productId : parseInt(searchParams.get('id')) }
        }).then((response) => {
            setCondimentIngredients(response.data)
        })
    }

    const getNutritionFacts = (product) => {
        
        let orderedCondiments = []

        if (product?.name === 'standard') {
            orderedCondiments = getLocalStorageItem('condiments')
        }

        if (product?.name !== 'standard') {
            orderedCondiments = product.name !== 'standard' && options === undefined ? [] : product.name !== 'standard' && options !== undefined ? options : productState?.condiments
        }

        request({
            url : api.GET_NUTRITIONFACTS,
            method : POST,
            data   : orderedCondiments,
            params : { productId : parseInt(searchParams.get('id')) }
        }).then((response) => {
            setNutritionFacts(response.data)
        })
    }

    useEffect(() => {
        getProducts(parseInt(searchParams.get('id')))
        window.scrollTo(0, 0)
        setHasLoaded(true)
    }, [])

    const renderStandardCondiments = () => {
        Object.values(productState?.condiments).sort((condimentA, condimemtB) => {
            return condimentA.optionsTypeId - condimemtB.optionsTypeId
        }).map((condiment, index) => (
            <span 
                key        = {condiment.name}
            >
                {index === 0 ? 'With ' : ''}
                {index === options?.length - 1 && options?.length > 1 && 'and '}
                {
                    condiment.name === 'cheese' 
                        ?   'melty cheese sauce'
                        :    condiment.name
                } 
                {index < options?.length - 1 ? ',' : ''}
                &nbsp;
            </span>
        ))
    }

    const renderCustomCondiments = () => (
        product.name !== 'standard' && getLocalStorageItem('options') ?
            Object.values(options).sort((condimentA, condimemtB) => {
                return condimentA.optionsTypeId - condimemtB.optionsTypeId
            }).map((condiment, index) => (
                <span 
                    key        = {condiment.name}
                >
                    {index === 0 ? 'With ' : ''}
                    {index === options?.length - 1 && options?.length > 1 && 'and '}
                    {
                        condiment.name === 'cheese' 
                            ?   'melty cheese sauce'
                            :    condiment.name
                    } 
                    {index < options?.length - 1 ? ',' : ''}
                    &nbsp;
                </span>
            ))
        :
            <span aria-label='No condiments' role='text'>No Condiments</span>
    )
       
    const getCondiments = () => {
        return  product.name === 'standard' ? renderStandardCondiments() : renderCustomCondiments()
    }

    const renderNutritionSize = (value, unit) => {
        return (
            <p aria-hidden={true}> 
                {value}{unit}
            </p>
        )       
    }

   return ( 
        <div className="flex flex-col justify-center items-center bg-white text-sm py-[15px] xxs:text-[10px] w-full">
            {renderSr()}
            <div className="xxs:flex xxs:items-center xxs:justify-center w-full">
                <button 
                    type    = "button"
                    onClick = {() => {
                        navigate(-1)
                    }}
                    className  = "flex bg-[#F5F5F5] justify-start absolute top-2 left-2 p-1"
                    aria-label = "Back Arrow Icon - Click to Exit out of Screen"
                    tabIndex   = {0}
                    role       = "button"
                >
                    <ChevronLeft className="h-[16px] w-[16px]" />
                </button>
            </div>
            {
                mainIngredientLoading && condimentLoading ? 
                <p className="text-center mt-[100%] h-screen text-lg">Loading.. .</p>
                :
                <div className  = "w-full mt-[4rem] 3xs:px[10px] xxs:px-[30px] xs:px-[35px] sm:px-[40px] md:px-20 lg:px-20 xl:px-20 2xl:px-20 px-[10px] text-robo-primaryTwo pb-[7rem] sm:text-[18px] xxs:text-sm xs:text-sm tracking-wide">
                    <div
                        tabIndex   = {0}   
                        role       = "text"
                    >
                        <p className   = "text-sm md:text-sm text-center text-base 3xs:text-xs xs:text-xs xxs:text-xxs" aria-label = "Percent Daily Value are based on a 2,000 calorie"> 
                            Percent Daily Value are based on a 2,000 calorie 
                        </p>
                        <p className   = "text-sm md:text-sm text-center text-base 3xs:text-xs xs:text-xs xxs:text-xxs" aria-label = "diet. Your daily values may be higher or lower"> 
                            diet. Your daily values may be higher or lower  
                        </p>
                        <p className   = "text-sm md:text-sm text-center text-base 3xs:text-xs xs:text-xs xxs:text-xxs" aria-label = "depending on your calories needs."> 
                            depending on your calories needs.
                        </p>
                    </div>
                    
                    <div 
                        tabIndex   = {0}   
                        role       = "text"
                    >
                        <h2 className="text-black md:text-xl sm:text-[18px] xxs:text-sm xs:text-sm font-futura-bold text-center mt-5 mb-1" aria-label="Allergens"> ALLERGENS </h2>
                        
                        {
                            options?.find(({ name }) => name === 'cheese') || product.name === 'standard'
                                ?   <div className="text-sm md:text-base py-0.5">
                                        <div className="flex flex-row w-full justify-between mt-4" aria-label="Milk, Contains">
                                            <p className="font-futura-bold" >MILK</p>
                                            <p className=""> Contains </p>
                                        </div>
                                    </div>
                            :   null
                        }
                        
                        <div key={product.name} className="text-sm md:text-base py-0.5">
                            <div className="flex flex-row w-full justify-between mt-4" aria-label="Gluten, Contains">
                                <p className="font-futura-bold">GLUTEN</p>
                                <p className=""> Contains </p>
                            </div>
                        </div>
                    </div>
                        
                    <div 
                        tabIndex   = {0}   
                        role       = "text"
                    >  
                        <div className="text-black md:text-base text-sm flex flex-col py-0.5 text-center gap-2 mt-6 relative"> 
                            <h2 className="text-black md:text-xl sm:text-[18px] xxs:text-sm xs:text-sm font-futura-bold" aria-label="Nutrition Facts"> NUTRITION FACTS</h2>
                            <p >
                                RoboBurger Burger - {product.name === 'standard' ? 'with ketchup, mustard, and melty cheese sauce' : getCondiments()}
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-[10px] text-sm sm:text-sm xs:text-xs xxs:text-xs 3xs:text-xxs md:text-base py-0.5">

                            <div className="flex flex-row w-full justify-between mt-4">
                                <p aria-label="Serving Size:" role="text"> Serving Size </p>
                                <p aria-label="1" role="text"> 1 </p>
                            </div>

                            <p className="text-right" aria-label="% Daily Value">% Daily Value*</p>
                    
                            <div className="flex flex-row w-full justify-between" aria-label={`Calories: ${nutritionFacts?.calories} grams`}>
                                <div className="flex flex-row justify-between w-3/5">
                                    <p>Calories</p>
                                    {renderNutritionSize(nutritionFacts?.calories, 'g')}
                                </div>
                            </div>
                        
                            <div className="flex flex-row w-full justify-between" aria-label={`Total Fat: ${nutritionFacts?.totalFatGrams} grams, ${nutritionFacts?.totalFatPercent} percent`} >
                                <div className="flex flex-row justify-between w-3/5">
                                    <p > Total Fat </p>
                                    {renderNutritionSize(nutritionFacts?.totalFatGrams, 'g')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.totalFatPercent, '%')}
                            </div>

                            <div className="flex flex-row w-full justify-between" aria-label={`Saturated Fat: ${nutritionFacts?.saturatedFatGrams} grams, ${nutritionFacts?.saturatedFatPercent} percent`} >
                                <div className="flex flex-row justify-between w-3/5">
                                    <p> Saturated Fat </p>
                                    {renderNutritionSize(nutritionFacts?.saturatedFatGrams, 'g')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.saturatedFatPercent, '%')}
                            </div>

                            <div className="flex flex-row w-full justify-between" >
                                <div className="flex flex-row justify-between w-3/5" aria-label={`Trans Fat: ${nutritionFacts?.transFat} gram`} >
                                    <p> Trans Fat </p>
                                    {renderNutritionSize(nutritionFacts?.transFat, 'g')}
                                </div>
                            </div>

                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-row justify-between w-3/5" aria-label={`Polyunsaturated Fat: ${nutritionFacts?.polyFat} grams`} >
                                    <p> Polyunsaturated Fat </p>
                                    {renderNutritionSize(nutritionFacts?.polyFat, 'g')}
                                </div>
                            </div>

                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-row justify-between w-3/5" aria-label={`Monounsaturated Fat: ${nutritionFacts?.monoFat} grams`} >
                                    <p> Monounsaturated Fat </p>
                                    {renderNutritionSize(nutritionFacts?.monoFat, 'g')}
                                </div>
                            </div>
                        
                            <div className="flex flex-row w-full justify-between" aria-label={`Cholesterol: ${nutritionFacts?.cholesterolGrams * 1000} miligrams, ${nutritionFacts?.cholesterolPercent} percent`}>
                                <div className="flex flex-row justify-between w-3/5">
                                    <p> Cholesterol </p>
                                    {renderNutritionSize(nutritionFacts?.cholesterolGrams * 1000, 'mg')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.cholesterolPercent, '%')}
                            </div>
                    
                            <div className="flex flex-row w-full justify-between" aria-label={`Sodium: ${(nutritionFacts?.sodiumGrams * 1000).toFixed(0)} miligrams, ${nutritionFacts?.sodiumPercent} percent `} >
                                <div className="flex flex-row justify-between w-3/5" >
                                    <p> Sodium </p>
                                    {renderNutritionSize((nutritionFacts?.sodiumGrams * 1000).toFixed(), 'mg')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.sodiumPercent, '%')}
                            </div>
                        
                        
                            <div className="flex flex-row w-full justify-between" aria-label={`Total Carbohydrate: ${nutritionFacts.totalCarbsGrams} grams, ${nutritionFacts?.totalCarbsPercent} percent`} >
                                <div className="flex flex-row justify-between w-3/5">
                                    <p> Total Carbohydrate </p>
                                    {renderNutritionSize(nutritionFacts?.totalCarbsGrams, 'g')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.totalCarbsPercent, '%')}
                            </div>

                            <div className="flex flex-row w-full justify-between" aria-label={`Dietary Fiber: ${nutritionFacts?.dietaryFiberGrams} gram, ${nutritionFacts?.dietaryFiberPercent} percent`} >
                                <div className="flex flex-row justify-between w-3/5">
                                    <p > Dietary Fiber </p>
                                    {renderNutritionSize(nutritionFacts?.dietaryFiberGrams, 'g')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.dietaryFiberPercent, '%')}
                            </div>

                            <div className="flex flex-row w-full justify-between">
                                <div className="flex flex-row justify-between w-3/5" aria-label={`Total Sugars: ${nutritionFacts?.totalSugars} grams`} >
                                    <p > Total Sugars </p>
                                    {renderNutritionSize(nutritionFacts?.totalSugars, 'g')}
                                </div>
                            </div>

                            <div className="flex flex-row w-full justify-between" aria-label="Includes: 2 grams added sugars, 4%"  >
                                <div className="flex flex-row justify-between w-3/5">
                                    <p> Includes </p>
                                    <p  className="text-right"> 2g Added Sugars </p>
                                </div>
                                <p>4%</p>
                            </div>

                            <div className="flex flex-row w-full justify-between" >
                                <div className="flex flex-row justify-between w-3/5" aria-label={`Protein: ${nutritionFacts?.protein} grams`} >
                                    <p > Protein </p>
                                    {renderNutritionSize(nutritionFacts?.protein, 'g')}
                                </div>
                            </div>

                            <div className="flex flex-row w-full justify-between" aria-label={`Calcium: ${nutritionFacts?.calciumGrams * 1000} miligrams, ${nutritionFacts?.calciumPercent} percent`} >
                                <div className="flex flex-row justify-between w-3/5">
                                    <p> Calcium </p>
                                    {renderNutritionSize(nutritionFacts?.calciumGrams * 1000, 'mg')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.calciumPercent, '%')}
                            </div>

                            <div className="flex flex-row w-full justify-between" aria-label={`Potassium: ${nutritionFacts?.potassiumGrams * 1000} miligrams, ${nutritionFacts?.potassiumPercent} percent`} >
                                <div className="flex flex-row justify-between w-3/5">
                                    <p> Potassium </p>
                                    {renderNutritionSize(nutritionFacts?.potassiumGrams * 1000, 'mg')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.potassiumPercent, '%')}
                            </div>

                            <div className="flex flex-row w-full justify-between" aria-label={`Iron: ${nutritionFacts?.ironGrams * 1000} miligrams, ${nutritionFacts?.ironPercent} percent` } >
                                <div className="flex flex-row justify-between w-3/5">
                                    <p> Iron </p>
                                    {renderNutritionSize(nutritionFacts?.ironGrams * 1000, 'mg')}
                                </div>
                                {renderNutritionSize(nutritionFacts?.ironPercent, '%')}
                            </div>
                        </div>
                    </div>
                    <div 
                        tabIndex   = {0}   
                        role       = "text"
                    > 
                        <h2 className="text-black md:text-xl sm:text-[18px] xxs:text-sm xs:text-sm font-futura-bold text-center mt-7" aria-label="INGREDIENTS"> INGREDIENTS </h2>
                        <div className="mt-3 space-y-3 text-sm sm:text-sm xs:text-xs xxs:text-xs 3xs:text-xxs">
                            {
                                mainIngredients.map((ingredient, index) => 
                                
                                <p className="tracking-wide text-justify w-full md:text-xl test" key={index} aria-label={`${ingredient?.name} : ${mutateIngredientsToString(ingredient)}`} >
                                    <span className="font-futura-bold" aria-hidden={true}> { ingredient?.name }: </span> 
                                    { ingredient?.mainIngredients?.map((subIngredient, index) => 
                                        <span key={index}>
                                            {subIngredient.name === "salt" ?  `Contains 2 percent or less of each of the following: ${subIngredient.name}` : subIngredient.name}
                                            {subIngredient.description ? ` (${subIngredient.description})` : "" }{index !== ingredient?.mainIngredients?.length - 1 ? ", " : ""}
                                        </span>
                                    ) }
                                </p>
                                )
                            }

                            {
                                condimentIngredients.map((ingredient, index) => 
                                <p className="tracking-wide text-justify w-full md:text-xl" key={index} >
                                    <span className="font-futura-bold"> { ingredient?.name }: </span> 
                                    { ingredient?.condimentIngredients?.map((subIngredient, index) => 
                                        <span key={index}>{subIngredient.name}{subIngredient.description ? ` (${subIngredient.description})` : "" }{index !== ingredient?.condimentIngredients?.length - 1 ? ", " : ""}</span>
                                    ) }
                                </p>
                                )
                            }
                            
                        </div> 
                    </div>
                </div>
            }
        </div>
   )
}

export default NutritionFacts