import React from 'react'
import { useState } from 'react'
import Window from './Window'
import ReactDOM from 'react-dom/client';

function Spacer() {
    var counter = 0

    const [rgb, setRgb] = useState({
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
    })

    function close(container) {
        const spacer = container.parentElement
        const topSpacer = spacer.parentElement
        let sibling = false


        if (container.previousElementSibling != null) {
            sibling = container.previousElementSibling
        }

        if (container.nextElementSibling != null) {
            sibling = container.nextElementSibling
        }
        
        if (sibling) {
            topSpacer.appendChild(sibling)
        }

        container.remove()
        spacer.remove()
    }

    function split(win, mode) {
        counter += 1
        const siblings =win.parentElement.children
        

        const spacer = document.createElement("div")
        const container = document.createElement("div")

        spacer.classList.add("spacer")
        spacer.id = Date.now()

        container.classList.add("container")
        
        win.parentElement.insertBefore(spacer, siblings[1])

        if (mode == "right") {
            spacer.appendChild(win)
            spacer.appendChild(container)
        }
        if (mode == "left") {
            spacer.appendChild(container)
            spacer.appendChild(win)
        }
        if (mode == "top") {
            spacer.style.flexDirection = "column"
            spacer.appendChild(container)
            spacer.appendChild(win)
        }
        if (mode == "bottom") {
            spacer.style.flexDirection = "column"
            spacer.appendChild(win)
            spacer.appendChild(container)
        }

        const root = ReactDOM.createRoot(container);
        root.render(<Window spawn={split} despawn={close} options={{id: `win_${Date.now()}`}}/>)
    }    

    return (
        <div className='spacer'>
            <div className='container'>
                <Window despawn={close} spawn={split} options={{id:`win_${Date.now()}`}}/>
            </div>
        </div>
    )
}

export default Spacer