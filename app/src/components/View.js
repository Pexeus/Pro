import React, { useEffect } from 'react'
import events from '../events';

function View({id}) {
    function link(id) {
        const view = document.getElementById(`view_${id}`)

        function adjust() {
            const container = document.getElementById(`container_${id}`)
            const rect = container.getBoundingClientRect();

            if (container.classList.contains("active")) {
                view.style.display = "block"
                view.style.width = `${container.offsetWidth}px`
                view.style.height = `${container.offsetHeight}px`
                view.style.top = `${rect.top}px`
                view.style.left = `${rect.left}px`
            }
            else {
                view.style.display = "none"
            }
        }

        adjust()

        window.addEventListener("resize", () => {
            adjust()
        })

        setInterval(() => {
            adjust()
        }, 100);
    }

    function register(id) {
        const view = document.getElementById(`webview_${id}`)
        let regsitered = false

        view.addEventListener("did-stop-loading", () => {
            if (!regsitered) {
                regsitered = true
                events.emit(`${id}-ready`)

                //view.openDevTools()
            }
        })
    }

    setTimeout(() => {
        register(id)
        link(id)
    }, 10);

    return (
        <div id={`view_${id}`} className='view'>
            <webview id={`webview_${id}`} src='https://www.google.com/' className='webview' preload='file://C:\Users\Liam\Documents\Git\hub\Pro\app\src\inject\com.js'/>
        </div>
    )
}

export default View