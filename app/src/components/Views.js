import React from 'react'
import events from '../events';
import { useState } from "react"
import View from './View';

function Views() {
    const [views, setViews] = useState([])
    const [viewClasses, setViewClasses] = useState("view")
    const [, updateState] = useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    events.on("views-display", display => {
        if (!display) {
            setViewClasses("views hidden")
        }

        if (display) {
            setViewClasses("views")
        }

    }, {dublicates: false})

    events.on("view-create", id => {
        setViews(current => [
            ...current,
            id
        ])

    }, {dublicates: false})

    events.on("view-remove", toDelete => {
        setViews(current => {
            const index = current.indexOf(toDelete)
            current.splice(index, 1)

            return current
        })

        forceUpdate()

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