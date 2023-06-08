
import React from 'react'
import { default as LinkExpired } from './components/LinkExpired'
import { default as NotFound } from './components/LinkNotFound'
import { useSearchParams } from 'react-router-dom'

const Error = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    switch(searchParams.get('message')) {
        case 'linkexpired': return <LinkExpired />
        case '404'        : 
        default           : return <NotFound />
    }
}

export default Error