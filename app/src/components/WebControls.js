import React from 'react'
import { IconContext } from "react-icons";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc"

function WebControls({ tab }) {
    const options = {
        forward: { opacity: 0.3 },
        back: { opacity: 0.3 },
    }

    function goBack() {
        if (!tab.view) {
            return
        }

        if (tab.view.canGoBack()) {
            tab.view.goBack()
        }
    }

    function goForward() {
        if (!tab.view) {
            return
        }
        
        if (tab.view.canGoForward()) {
            tab.view.goForward()
        }
    }

    function update() {
        if (!tab.view) {
            return
        }

        if (tab.view.canGoForward()) {
            options.forward.opacity = 1
        }
        if (tab.view.canGoBack()) {
            options.back.opacity = 1
        }

        tab.forward =
            <div className='forward' style={{ opacity: options.forward.opacity }} onClick={goForward}>
                <VscChevronRight />
            </div>

        tab.backward =
            <div className='backward' style={{ opacity: options.back.opacity }} onClick={goBack}>
                <VscChevronLeft />
            </div>
    }

    update()

    return (
        <div className='webControls'>
            <IconContext.Provider value={{ size: "1.5em", color: "red" }}>
                {tab.backward}
                {tab.forward}
            </IconContext.Provider>
        </div>
    )
}

export default WebControls