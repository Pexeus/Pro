import React from 'react'
import { IconContext } from "react-icons";
import { VscChromeRestore, VscChromeMaximize, VscChromeClose, VscChromeMinimize, VscRefresh, VscChevronLeft, VscChevronRight } from "react-icons/vsc"
import events from '../events';
import {useState} from "react"
import WebControls from './WebControls';

function Head() {
    const [, updateState] = useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const [tab, setTab] = useState({
        url: "",
        host: ""
    })

    function update(id) {
        const webview = document.getElementById(`webview_${id}`)

        setTab(current => {
            current.url = webview.getURL()
            current.host = current.url.split("https://")[1].split("/")[0].replace("/", "")
            current.title = webview.getTitle()
            current.id = id
            current.view = webview

            return current
        })

        forceUpdate()
    }

    function init() {
        const webview = tab.view

        //removing old event listeners
        webview.removeEventListener("did-stop-loading", onLoad)
        webview.removeEventListener("did-start-loading", onLoad)
        webview.removeEventListener("load-commit", onLoad)

        function onLoad(e) {
            if (Number(e.target.id.match(/\d+/)[0]) == tab.id) {
                update(tab.id)
            }
        }

        webview.addEventListener("did-stop-loading", onLoad)
        webview.addEventListener("did-start-loading", onLoad)
        webview.addEventListener("load-commit", onLoad)
    }

    events.on("tab-focused", id => {
        update(id)
        init()
    }, {dublicates: false})

    return (
        <div className='head'>
            <div className='menu'>
                <WebControls tab={tab}/>
                <div className='UrlInputContainer'>
                    <div className='inputWrapper'>
                        <input className='urlInput' type="text" value={tab.host} onChange={() => {console.log("test");}}/>
                        <div className='reload'>
                        <IconContext.Provider value={{ size: "1em" }}>
                            <VscRefresh onClick={() => {tab.view.reload()}}/>
                        </IconContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
            <div className='windowOptions'>
                <IconContext.Provider value={{ size: "1em" }}>
                    <div className='option'>
                        <VscChromeMinimize />
                    </div>
                    <div className='option'>
                        <VscChromeRestore />
                    </div>
                    <div className='option'>
                        <VscChromeClose />
                    </div>
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default Head