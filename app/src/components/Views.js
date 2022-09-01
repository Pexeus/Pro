import React from 'react'
import events from '../events';
import { useState } from "react"
import View from './View';

function Views() {
    const [views, setViews] = useState([])
    const [viewClasses, setViewClasses] = useState("view")

    events.on("views-display", display => {
        if (!display) {
            setViewClasses("view hidden")
        }

        if (display) {
            setViewClasses("view")
        }

    }, {dublicates: false})

    events.on("view-create", id => {
        setViews(current => [
            ...current,
            id
        ])

    }, {dublicates: false})


    return (
        <div className={viewClasses}>
            {views.map(id => (
                <View key={id} id={id}/>
            ))}
        </div>
    )
}

export default Views