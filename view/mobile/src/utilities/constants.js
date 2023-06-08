// IMAGES
import BACKGROUND1 from '../assets/images/home-placeholder-2.png'
import BURGERSPLASH from '../assets/images/burger-splash.png'
import CARTPRODUCTIMAGE from '../assets/images/cart/cart-product.png'
import CHECKCIRCLE from '../assets/images/check-circle.png'
import EMPTYCART from '../assets/images/cart/empty-cart.png'
import LARGEROBOLOADING from '../assets/images/large-robo-loading.jpg'
import LOGO from '../assets/images/logo.png'
import LOCATIONMARKER from '../assets/images/location-marker-2.png'
import LOCATIONPINLOGO from '../assets/images/location-pin-logo.png'
import LOCATIONPINWITHLOGO from '../assets/images/location-pin-with-logo-2.png'
import RESETCONFIRMATION from '../assets/images/reset-confirmation.png'
import ROBOHOME from '../assets/images/robo-home.png'
import ROBOLOADING from '../assets/images/robo-loading.png'
import ROBOLOGO from '../assets/images/RoboLogo.png'
import ROBO1760X1080 from '../assets/images/Robo(1760x1080).webp'
import ROBO800X1240 from '../assets/images/Robo(800x1200).webp'
import ROBO1920X1200 from '../assets/images/Robo(1920x1200).webp'
import ROBO320X568 from '../assets/images/Robo(320x568).webp'
import ROBO240X320 from '../assets/images/Robo(240x320).webp'
import SUCCESS from '../assets/images/success.png'
import STANDARDBURGER2X from '../assets/images/standard_burger@2x.png'
import INFO3X from '../assets/images/info@3x.png'
import CHEESE3X from '../assets/images/condiments/Cheese@3x.png'
import MUSTARD3X from '../assets/images/condiments/Mustard@3x.png'
import KETCHUP3X from '../assets/images/condiments/Ketchup@3x.png'
import NUTRITIONFACTS3X from '../assets/images/NutritionFacts@3x.png'
import RELISH3X from '../assets/images/condiments/Relish@3x.png'
import ROBOMAGICSAUCE3X from '../assets/images/condiments/RoboMagicSauce@3x.png'
import BBQ3X from '../assets/images/condiments/BBQ@3x.png'
import CARTPRODUCTIMAGES from '../assets/images/cart/CARTPRODUCTIMAGE.png'
import EMAIL3X from '../assets/images/Email@3x.png'
import VERIFYEMAIL from '../assets/images/VerifyEmail.png'
import CARTPRODUCTIMAGELANDSCAPE from '../assets/images/cart-product-image-landscape.png'
import ROBOLOGOCIRCLE from '../assets/images/robo-logo.png'

// PAYMENT
import APPLEPAY from '../assets/images/checkout/apple-pay.png'
import PAYPAL from '../assets/images/checkout/paypal.png'

// FORM VALIDATION
export const EMAIL_REQUIRED_FIELD                = 'Please provide your email address.'
export const EMAIL_OR_PHONENUMBER_REQUIRED_FIELD = 'Email or Phone Number is required.'
export const FIRSTNAME_REQUIRED_FIELD            = 'Please provide your first name.'
export const INVALID_CODE                        = 'This code is invalid, please check your '
export const INVALID_EMAIL                       = 'Please provide a valid email address.'
export const INVALID_EMAIL_OR_PHONENUMBER        = 'Please provide a valid email address or phone number.'
export const INVALID_FIRST_NAME                  = 'Please provide a valid first name.'
export const INVALID_LAST_NAME                   = 'Please provide a valid last name.'
export const INVALID_PASSWORD                    = 'The password you entered is incorrect.'
export const INVALID_PHONENUMBER                 = 'Please provide a valid phone number.'
export const LASTNAME_REQUIRED_FIELD             = 'Please provide your last name.'
export const NOT_EXISTS_EMAIL                    = 'The email address does not exist.'
export const NUMBERS_ONLY                        = 'Only numerical characters are allowed.'
export const PASSWORD_NOT_MATCH                  = 'Passwords didn\'t match.'
export const PASSWORD_REQUIRED_FIELD             = 'Please enter your password.'
export const PHONENUMBER_MAXIMUM                 = 'Your phone number must not exceed 15 digits.'
export const PHONENUMBER_MINIMUM                 = 'Your phone number must be at least 10 digits.'
export const PHONENUMBER_REQUIRED_FIELD          = 'Please provide your phone number.'
export const REQUIRED_FIELD                      = 'This field is required.'
export const SU_PASSWORD_REQUIRED_FIELD          = 'Please provide a password.'
export const STRICTLY_SIX_DIGITS                 = 'Must be exactly 6 digits'
export const ZIPCODE_REQUIRED_FIELD              = 'Please provide your zip code.'

// PAYMENT
export const INVALID_CCNAME     = "Card holder name is invalid."
export const INVALID_CCNUMBER   = "Invalid card number."
export const INVALID_EXPIRYDATE = "Expiry date is invalid."
export const INVALID_CVV        = "Security code is invalid."
export const EXPIRED_CARD       = "The card you are using has expired. Please check your card details and try again."
export const CARD_NAME          = "Please enter your card name."
export const CARD_NUMBER        = "Please enter your card number."

export const EXPIRATION_DATE = [/\d/, /\d/, "/", /\d/, /\d/]
export const CVV = [/\d/, /\d/, /\d/]
export const AMEXCVV = [/\d/, /\d/, /\d/, /\d/]

export const OTHERCARDS = [/[1-9]/,/\d/,/\d/,/\d/," ",/\d/,/\d/,/\d/,/\d/," ",/\d/,/\d/,/\d/,/\d/," ",/\d/,/\d/,/\d/,/\d/, /\d/,/\d/,/\d/]

// AXIOS CONFIGURATION
export const BEARER = 'Bearer '
export const DELETE = 'DELETE'
export const GET    = 'GET'
export const PATCH  = 'PATCH'
export const POST   = 'POST'
export const PUT    = 'PUT'

// PASSWORD REGEX
export const allRegex         = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
export const emailRegex       = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm
export const lowercaseRegex   = /(?=.*[a-z])/
export const numericRegex     = /(?=.*\d)/
export const phoneNumberRegex = /^\+?[1-9][0-9]{7,14}$/
export const specialRegex     = /(?=.*[!@#$%^&*”“(),.?":{}|<_>])/    
export const uppercaseRegex   = /(?=.*[A-Z])/

export const userLocationColor = {
    'google-blue 100': `#4285F4`,
    'white 100': `rgb(255,255,255)`,
}

export const passwordRegex = [
    {
        regex        : lowercaseRegex,
        description  : 'At least 1 lower case character.',
        accessibility: 'You need to input at least 1 lower case character.'
    },
    {
        regex        : uppercaseRegex,
        description  : 'At least 1 upper case character.',
        accessibility: 'You need to input at least 1 upper case character.'
    },
    {
        regex        : numericRegex,
        description  : 'At least 1 numerical number character.',
        accessibility: 'You need to input at least 1 number.'
    },
    {
        regex        : specialRegex,
        description  : 'At least 1 special character.',
        accessibility: 'You need to input at least 1 special character.'
    }
]

export const zipCodeRegex          = /(^\d{5}$)|(^\d{5}-\d{4}$)/
export const firstAndLastNameRegex = /^[a-zA-Z ]+$/

export const CONDIMENTS_LABEL = {
    mustard       : 'Mustard',
    ketchup       : 'Ketchup',
    cheese        : 'Melty Cheese',
    relish        : 'Relish',
    robomagicsauce: 'Robo Magic Sauce',
    bbq           : 'BBQ'
}

export const IMAGES = {
    BACKGROUND1,
    BURGERSPLASH,
    CHECKCIRCLE,
    LARGEROBOLOADING,
    LOCATIONMARKER,
    LOCATIONPINLOGO,
    LOCATIONPINWITHLOGO,
    LOGO,
    RESETCONFIRMATION,
    ROBO1760X1080,
    ROBO800X1240,
    ROBO1920X1200,
    ROBO320X568,
    ROBO240X320,
    SUCCESS,
    ROBOHOME,
    ROBOLOADING,
    ROBOLOGO,
    CARTPRODUCTIMAGES,
    CARTPRODUCTIMAGE,
    STANDARDBURGER2X,
    INFO3X,
    CONDIMENTS: {
        mustard: MUSTARD3X,
        ketchup: KETCHUP3X,
        cheese: CHEESE3X,
        relish: RELISH3X,
        robomagicsauce: ROBOMAGICSAUCE3X,
        bbq: BBQ3X
    },
    NUTRITIONFACTS3X,
    EMPTYCART,
    CONDIMENTS_LABEL,    
    APPLEPAY,
    PAYPAL,
    EMAIL3X,
    VERIFYEMAIL,
    CARTPRODUCTIMAGELANDSCAPE,
    ROBOLOGOCIRCLE
}

export const LIBRARIES = ['places']

export const MAP_CENTER = { 
    lat: 14.8248203, 
    lng: 120.5109386 
}
  
export const MAP_CONTAINER = { 
    height: '100%', 
    width : '100vw'
}
  
export const MAP_STYLE = [
    {
        elementType: "geometry",
        stylers    : [
            {
                color: "red"
            }
        ]
    },
    {
        elementType: "labels.text.fill",
        stylers    : [
            {
                color: "#707070",
                fontSize: "25px"
            }
        ]
    },
    {
        elementType: "labels.text.stroke",
        stylers    : [
            {
                color: "#FFFFFF"
            }
        ]
    },
    {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers    : [
            {
                // color: "#F3F0EB"
                visibility: "off"
            }
        ]
    },
    {
        featureType: "administrative.land_parcel",
        elementType: "geometry.stroke",
        stylers    : [
            {
                // color: "#FF0000"
            }
        ]
    },
    {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers    : [
            {
                color: "#707070"
            }
        ]
    },
    {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers    : [
            {
                visibility: "off"
                // color: "#D8D8D8"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers    : [
            {
                // visibility: "off"
                color: "#e5e3df"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "labels.text.stroke",
        stylers    : [
            {
                color: "#FFFFFF"
            }
        ]
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers    : [
            {
                color: "#707070"
            }
        ]
    },
    {
        featureType: "poi.attraction",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "poi.business",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "poi.government",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "poi.medical",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "poi.park",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "poi.place_of_worship",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "poi.school",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "poi.sports_complex",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers    : [
            {
                color: "#FDFDFC"
            }
        ]
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers    : [
            {
                color: "#FDFDFC"
            }
        ]
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers    : [
            {
                color: "#8D8D8D"
            }
        ]
    },
    {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers    : [
            {
                color: "#707070"
            }
        ]
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers    : [
            {
                color: "#707070"
            }
        ]
    },
    {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers    : [
            {
                color: "#FFFFFF"
            }
        ]
    },
    {
        featureType: "road.local",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "transit.line",
        elementType: "geometry",
        stylers    : [
            {
                color: "#dfd2ae"
            }
        ]
    },
    {
        featureType: "transit.line",
        elementType: "labels.text.fill",
        stylers    : [
            {
                color: "#707070"
            }
        ]
    },
    {
        featureType: "transit.line",
        elementType: "labels.text.stroke",
        stylers    : [
            {
                color: "#ebe3cd"
            }
        ]
    },
    {
        featureType: "transit.station",
        elementType: "geometry",
        stylers    : [
            {
                color: "#e5e3df"
            }
        ]
    },
    {
        featureType: "transit.station",
        elementType: "labels.icon",
        stylers    : [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "water",
        elementType: "geometry.fill",
        stylers    : [
            {
                color: "#d4f1f9"
            }
        ]
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers    : [
            {
                color: "#707070"
            }
        ]
    }
]
