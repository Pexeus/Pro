import React from 'react'
import { IconContext } from "react-icons";
import { VscChromeClose } from "react-icons/vsc"
import events from '../events';

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

    function dragStart(e) {
        e.dataTransfer.setData('mode', "tab"); 
        e.dataTransfer.setData('id', tab.id);  
        events.emit("views-display", false)
    }

    init()

    return (
        <div draggable="true" onDragStart={dragStart} className={`tab ${String(tab.visible)}`} key={tab.id} onClick={(e) => {setVisibleHandler(tab.id, e)}}>
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