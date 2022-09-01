import React from 'react'
import Spacer from './Spacer'
import Views from "./Views"


export default function Host() {
    const defaultWindows = [{
        id: 0,
        start: "https:google.com"
    }]

    return(
        <div className='host'>
            <Spacer/>
            <Views/>
        </div>
    )
}
