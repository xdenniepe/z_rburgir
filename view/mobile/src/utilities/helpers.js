import moment from 'moment-timezone'

// Set local storage item.
export const setLocalStorageItem = (storageKey, state) => {
    localStorage.setItem(storageKey, JSON.stringify(state))
}

// Get local storage item.
export const getLocalStorageItem = (storageKey) => {
    const savedState = localStorage.getItem(storageKey)

    try {
        if (!savedState) return undefined

        return JSON.parse(savedState ?? '{}')
    } catch (e) {
        return undefined
    }
}

// Remove local storage item.
export const removeLocalStorageItem = storageKey => localStorage.removeItem(storageKey)

// Join classes.
export const className = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

// Get input classes.
export const getInputClasses = (formik, fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
        return 'focus:outline-none focus-within:border-red-500 border-red-500 is-invalid'
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
        return 'focus:outline-none focus-within:border-gray-500 border-gray-500 is-valid'
    }

    return ''
}

// Get masked input classes.
export const getMaskedInputClasses = (formik, fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
        return 'focus:outline-none border-red-500 border-red-500 is-invalid'
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
        return 'focus:outline-none border-gray-500 border-gray-500 is-valid'
    }

    return 'border-gray-500'
}

// Display error.
export const displayError = (formik, fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
        return formik.errors[fieldname]
    }

    return null
}

// Automatic capitalization.
export const autoCapitalize = (content) => {
    const words = content.split(' ')

    return words.map((word) => {
        return word[0].toUpperCase() + word.substring(1).toLowerCase()
    }).join(' ')
}

// Shuffle array.
export const shuffleArray = (array) => {
    if (!array) return []

    let currentIndex = array.length, randomIndex

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
}

// Get sum of array.
export const getSumOfArray = (array, decimal) => {
    if (!array) return 0 

    return array.reduce((a, b) => a + b, 0).toFixed(decimal)
}

// Format timestamp to Pacific Standard Time.
export const formatToPst = (unix) => {
    if (unix instanceof Date) return ''
     
    return moment.unix(unix).tz('America/Los_Angeles').format('D MMMM, hh:mm A')
}

export const formatToPstPDF = (unix) => {
    if(unix instanceof Date) return '';
     
    return moment.unix(unix).tz('America/Los_Angeles').format("D MMMM, hh:mm A");
}

// Add leading zeros.
export const addLeadingZeros = (num, size) => {
    var numberString = num + ''

    while (numberString.length < size) numberString = '0' + numberString
    
    return numberString
}

// Space remover.
export const letterSpaceRemover = (wordToChange) => {
    return wordToChange?.replace(/\s/g,'')
}

// Special character remover.
export const letterSpecialCharRemover = (wordToChange) => {
    return wordToChange?.replace(/[^a-zA-Z ]/g, ' ')
}

// Convert first letter to uppercase.
export const firstLetterToUpper = (wordLetter) => {
    return wordLetter?.replace(/\b(\w)/g, s => s.toUpperCase())
}

// Get difference between two given dates.
export const getDifferenceInDays = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1)

    return diffInMs / (1000 * 60 * 60 * 24)
}

// Capitalizes all letters.
export const capitalizeFirstLowercaseRest = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Checks if array is empty or not.
export const isEmptyArray = arr => arr.length === 0

// Checks if objects has no properties.
export const isEmptyObject = obj => Object.keys(obj).length === 0


// Callback function of evaluate()
const evaluated = x => ({
    compare  : () => evaluated(x),
    otherwise: () => x
})

// Checks if else or switch statements in a declarative way.
export const evaluate = x => ({
    compare  : (pred, fn) => (pred(x) ? evaluated(fn(x)) : evaluate(x)),
    otherwise: fn => fn(x)
})

export const tryCatch = fn => {
    return () => {
        try { 
            fn() 
        } catch (err) {
            console.error(err?.message || err)
        }
    }
}


export const padWithLeadingZeros = (num) => {
    return String(num).padStart(5, '0');
}

//create aria label of condiments
export const mutateCondimentsToString = subIngredients => {
    return subIngredients.map(({ name }, index) => {
        let condimentName = name === 'cheese' ? 'melty cheese sauce' : name

        if (index === 0) {
            condimentName = capitalizeFirstLowercaseRest(condimentName)
        }
         
        return index === subIngredients.length - 1 ? condimentName :  condimentName + ', '
    })
}

//create aria label of ingredients
export const mutateIngredientsToString = ingredient => {

    return ingredient?.mainIngredients?.map(( subIngredient, index) => {
        let subIngredients = ingredient?.name === "Martin's Potato Roll" && subIngredient.name == "salt" ? `Contains 2 Percent Or Less Of Each Of The Following: ${subIngredient.name}` : " " + subIngredient.name + (subIngredient.description && "(" + subIngredient.description + ")" )
         
        return index === ingredient?.mainIngredients.length - 1 ? subIngredients + "," : subIngredients 
    })
}
    
// Remove plus on phone number.
export const includePlus = phoneNumber => phoneNumber.includes('+') ? phoneNumber : `+${phoneNumber}`

