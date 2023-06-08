module.exports = {
    content : [
        './src/**/*.{js,jsx,ts,tsx}', 
        './index.html'
    ],
    variants: {
        borderColor: ['responsive', 'hover', 'focus', 'focus-within']
    },
    theme: {
        screens: {
            '3xs': { min: '0px', max: '319px' },
            'xxs': { min: '320px', max: '374px' }, 
            'xs' : { min: '375px', max: '424px' }, 
            'sm' : { min: '425px', max: '767px' },
            'md' : '768px',
            'lg' : '1024px',
            'xl' : '1280px',
            '2xl': '1536px'
        },
        extend: {
            fontSize: {
                'xxs': '10px',
                'xs' : '12px',
                'md' : '16px',
                '3xs': '7.5px'
            },
            spacing: {
                '4.5' : '19px',
                '5.5' : '22px',
                '5.7' : '23px',
                '6.3' : '26px',
                '6.5' : '27px',
                '7.4' : '30px',
                '7.5' : '31px',
                '8.5' : '33px',
                '9.5' : '38px',
                '10.5': '41px',
                '20.5': '70px',
                '21'  : '84px',
                '23'  : '88px',
                '26'  : '104px',
                '30'  : '116px',
                '34'  : '136px',
                '38'  : '148px'
            },
            transformOrigin: {
                '0': '0%'
            },
            zIndex: {
                '-1': '-1'
            },
            dropShadow: {
                primary         : '0 2px 2px rgba(0,0,0,0.16)',
                container       : '0 2px 2px rgba(0,0,0,0.20)',
                bottomNavigation: [
                    '45px 45px 45px rgba(0, 0, 0, 0.30)',
                    '45px 65px 100px rgba(0, 0, 0, 0.30)'
                ]
            },
            colors: {
                gray: {
                    50 : '#E6E8E9',
                    100: '#DCDBD9',
                    200: '#757575',
                    500: '#707070',
                    550: '#707071',
                    600: '#1A1311',
                    700: '#3A2103'
                },
                red: {
                    600 : '#EFE2E2',
                    700 : '#FF5454',
                    800 : '#A10601',
                    900 : '#FAFAFA',
                    1000: '#990000' // For borders under headlines.
                },
                blue: {
                    500: '#15224F'
                },
                robo: {
                    primaryOne    : '#ebe8e3',      // Cream
                    primaryTwo    : '#37250d',      // Brown 
                    primaryThree  : '#c0b9af',      // Dark Brown
                    primaryFour   : '#e7bcab',      // Peach
                    primaryFive   : '#a6252a',      // Red
                    primarySix    : '#E8D6C0',      // For condiments BG
                    primarySeven  : '#C50100',
                    primaryEight  : '#663B02',      // brown fonts
                    secondaryOne  : '#f3f7f6',      // White
                    secondaryTwo  : '#ebe2a7',      // Light yellow
                    secondaryThree: '#c5a955',      // Dark Gold
                    secondaryFour : '#dff1e5',      // Mint
                    secondaryFive : '#a4c1ad',      // Blue
                    navborder     : '#D8D8D8',      // For border above the bottom navigation.
                    classicbg     : '#D1D1D1',      // For classic burger background.
                    classicshadow : '#00000008',    // For classic burger box shadow. 
                    currency      : '#3A2103',      // For cart currency.
                    navicon       : '#4b4b4b',      // For bottom navigation icons. 
                    total         : '#F5F5F5',      // For total amount container.
                    emptycart     : '#751132'
                }
            },
            letterSpacing: {
                tighter : '0.25px',
                tight   : '0.72px',
                wide    : '0.96px',
                widest  : '1.6px',
                sm      : '0.16px'
            },
            fontFamily: {
                'body'       : ['Futura-Medium'],
                'default'    : ['Futura'],
                'futura-bold': ['Futura-Bold'],
                'original'   : ['Futura-Orignal'],
                'sans'       : ['Futura-Medium']
            },
            backgroundImage: {
                'map-bg'    : "url('/src/assets/images/menu/bg-map.png')",
                'product-bg': "url('https://roboburgerdev.blob.core.windows.net/email-templates/melty-cheese.jpg')"
            }
        }, 
    },
    variants: {
        opacity: ({ after }) => after(['disabled'])
    },
    plugins: [
    ]
}
