import React from 'react'
import { IconContext } from "react-icons";
import { VscChromeRestore, VscChromeMaximize, VscChromeClose, VscChromeMinimize, VscRefresh, VscChevronLeft, VscChevronRight } from "react-icons/vsc"
import events from '../events';
import {useState, useEffect} from "react"
import WebControls from './WebControls';

function Head() {
    const [, updateState] = useState();

    const [tab, setTab] = useState({
        url: "",
        host: "",
        typing: false
    })

    function update(id) {
        const webview = document.getElementById(`webview_${id}`)
        const url = webview.getURL()
        const host = url.split("https://")[1].split("/")[0].replace("/", "")

        if (tab.typing == false) {
            const urlInput = document.getElementById("urlInput")
            urlInput.value = webview.getURL().split("https://")[1].split("/")[0].replace("/", "")
        }

        const update = {
            url: url,
            host: host,
            title: webview.getTitle(),
            id: id,
            view: webview
        }

        setTab(current => ({
            ...current,
            ...update
        }))
    }

    //url Input stuff
    function onType(e) {
        const input = e.target.value
        const webview = document.getElementById(`webview_${tab.id}`)
        let url

        if (input.slice(0, 4).toLowerCase() == "http") {
            url = input
        }
        else {
            url = `https://www.google.com/search?q=${input}`
        }

        if (e.key == "Enter") {
            e.target.disabled = true
            e.target.disabled = false
            webview.loadURL(url)
        }
    }

    function onUnfocus() {
        const urlInput = document.getElementById("urlInput")

        tab.typing = false
        urlInput.value = tab.host
    }

    function onFocus() {
        const urlInput = document.getElementById("urlInput")

        tab.typing = true
        urlInput.value = tab.url
    }


    function init() {
        const webview = tab.view
        const urlInput = document.getElementById("urlInput")

        //removing old event listeners
        webview.removeEventListener("did-stop-loading", onLoad)
        webview.removeEventListener("did-start-loading", onLoad)
        webview.removeEventListener("load-commit", onLoad)
        urlInput.removeEventListener("focusout", onUnfocus)

        function onLoad(e) {
            if (Number(e.target.id.match(/\d+/)[0]) == tab.id) {
                update(tab.id)
            }
        }

        webview.addEventListener("did-stop-loading", onLoad)
        webview.addEventListener("did-start-loading", onLoad)
        webview.addEventListener("load-commit", onLoad)
        urlInput.addEventListener("focusout", onUnfocus)
    }

    useEffect(() => {
        if (tab.view) {
            init()
        }
    }, [tab])

    events.on("tab-focused", id => {
        update(id)

        setTimeout(() => {
            events.emit("tab-focused-ready", id)
        }, 10);
    }, {dublicates: false})

    return (
        <div className='head'>
            <div className='menu'>
                <WebControls tab={tab}/>
                <div className='UrlInputContainer'>
                    <div className='inputWrapper'>
                        <input className='urlInput' id='urlInput' type="text" onFocus={onFocus} onKeyPress={(onType)}/>
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