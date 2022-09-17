import React from 'react'
import { IconContext } from "react-icons";
import { VscChromeClose } from "react-icons/vsc"

function tab({ tab, setVisible, close }) {
    function init() {
        if (tab.status == "loading") {
            tab.icon = <i className="gg-spinner-wait"></i>
        }

        if (tab.status == "commit") {
            tab.icon = <i className="gg-spinner-load"></i>
        }
        
        if (tab.status == "idle") {
            tab.icon = <img src={tab.favicon} alt="" />
        }
    }

    function setVisibleHandler(id, e) {
        if (e.target.classList.contains("closeTabIcon")) {
            return
        }

        setVisible(id)
    }

    init()

    return (
        <div className={`tab ${String(tab.visible)}`} key={tab.id} onClick={(e) => {setVisibleHandler(tab.id, e)}}>
            <div className='icon'>
                {tab.icon}
            </div>
            <div className='title'>
                <p>{tab.title}</p>
            </div>
            <div className='closeTab'>
                <IconContext.Provider value={{ size: "0.8em"}}>
                    <VscChromeClose className='closeTabIcon' onClick={() => {close(tab)}}/>
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default tab