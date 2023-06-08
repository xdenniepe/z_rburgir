import { useEffect } from 'react'
import { useAuthCtx } from '../../hooks'
import { Carousel } from 'react-responsive-carousel'
import ProductMenu from '../Products/components/ProductMenu'

const Home = ({ setHasLoaded, renderSr, toast }) => {
    const { user } = useAuthCtx().state
  
    useEffect(() => {
        setHasLoaded(true)
    }, [])

    const images = [
        {
          src: 'https://roboburgerdev.blob.core.windows.net/public-images/home-image-1.png',
          ariaLabel: 'First Image of a RoboBurger'
        },
        {
          src: 'https://roboburgerdev.blob.core.windows.net/public-images/home-image-1.png',
          ariaLabel: 'Second Image of a RoboBurger'
        },
        {
          src: 'https://roboburgerdev.blob.core.windows.net/public-images/home-image-1.png',
          ariaLabel: 'Third Image of a RoboBurger'
        }
    ]

    return (
        <div className="container-class relative bg-map-bg bg-cover bg-no-repeat pt-[23px] overflow-y-auto">
        {renderSr()}
        <div className="absolute w-full h-full pt-4 pb-26">
            <div className={`table-cell align-middle w-screen h-[52px] bg-[#A6252A] z-[2]}`}>
                <h1 
                    aria-label = {`Hello ${ user.firstName === null ? 'Human' : user.firstName }! See what's new:`}
                    className  = {`text-robo-primaryFour text-lg tracking-widest text-left pl-[31px] font-futura tracking-[1px]`} 
                    tabIndex   = {0}
                    role       = "text"
                > 
                    Hello { user.firstName === null ? 'Human' : user.firstName }! See what's new: 
                </h1>
            </div>
            
            <div className="w-full pt-[31px] sm:pt-[26px] xs:pt-[24px] xxs:pt-[22px] 3xs:pt-[22px] pb-[22px] sm:pb-[22px] xs:pb-[18px] xxs:pb-[16px] 3xs:pb-[14px]">
                <Carousel
                    showArrows     = {false}
                    showStatus     = {false}
                    showIndicators = {true}
                    showThumbs     = {false}
                    centerMode     = {false}
                    infiniteLoop   = {true}
                    stopOnHover    = {false}
                    swipeable      = {true}
                    autoPlay       = {true}
                    interval       = {5000}
                >
                    {images.map((image, index) => (
                    <div key={index} role="image">
                        <img
                            className   = "demo-item"
                            src         = {image.src}
                            aria-label  = {image.ariaLabel}
                            tabIndex    = {0}
                        />
                        <p className="sr-only" tabIndex={0}>toasted potato bun</p>
                        <p className="sr-only" tabIndex={0}>aged cheddar melty cheese sauce</p>
                        <p className="sr-only" tabIndex={0}>grilled angus beef patty</p>
                    </div>
                    ))}
                </Carousel>
            </div>

            <div className="w-full sm:pb-[25px] xs:pb-[40px] xxs:pb-[50px] 3xs:pb-[60px]">
                <ProductMenu toast={toast}/>
            </div>
        </div>
    </div>
    )
}

export default Home