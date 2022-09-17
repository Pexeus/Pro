import React, { useState } from 'react'
import events from '../events';

function View({id}) {
    //enorm scuffte shit, da mueses e besseri lösig geh
    let [initiated, setInit] = useState(false)
    const startpage = "https://www.google.com/"

    function link() {
        const view = document.getElementById(`view_${id}`)

        function adjust() {
            const container = document.getElementById(`container_${id}`)

            if (container == null) {
                window.removeEventListener("resize", adjust)
                document.removeEventListener("tab-focused-ready", adjust)

                return
            }

            const rect = container.getBoundingClientRect();

            if (container.classList.contains("active")) {
                view.style.width = `${container.offsetWidth}px`
                view.style.height = `${container.offsetHeight}px`
                view.style.top = `${rect.top}px`
                view.style.left = `${rect.left}px`
                view.style.display = "block"
            }
            else {
                view.style.display = "none"
            }
        }

        window.addEventListener("resize", adjust)
        document.addEventListener("tab-focused-ready", adjust)

        adjust()
    }


    function register() {
        const view = document.getElementById(`webview_${id}`)

        function sendReadySignal() {
            events.emit(`${id}-ready`)
            view.removeEventListener("did-stop-loading", sendReadySignal)
        }

        view.addEventListener("did-stop-loading", sendReadySignal)
    }

    function enableDevTools(id) {
        const view = document.getElementById(`webview_${id}`)
        const devtools = document.getElementById(`devtools_${id}`)
        const devtoolsWindow = document.getElementById(`devtools_window_${id}`)

        devtoolsWindow.style.display = "block"

        const viewId = view.getWebContentsId()
        const devId = devtools.getWebContentsId()

        window.send("devtools-enable", {view: viewId, devtools: devId})

        enableDevToolsResizer(id)
    }

    function enableDevToolsResizer(id) {
        const devtools = document.getElementById(`devtools_window_${id}`)
        const resizer = devtools.children[0]
        
        let m_pos;

        function resize(e){
            var parent = resizer.parentNode;
            var dx = m_pos - e.x;
            m_pos = e.x;
            parent.style.width = (parseInt(getComputedStyle(parent, '').width) + dx) + "px";
        }

        resizer.addEventListener("mousedown", function(e){
            m_pos = e.x;
            document.addEventListener("mousemove", resize, false);
        }, false);

        document.addEventListener("mouseup", function(){
            document.removeEventListener("mousemove", resize, false);
        }, false);
    }

    function disableDevTools(id) {
        const devtoolsWindow = document.getElementById(`devtools_window_${id}`)
        devtoolsWindow.style.display = "none"
    }

    function init() {
        const view = document.getElementById(`webview_${id}`)
        
        link()
        register()
        setInit(true)

        view.addEventListener("ipc-message", e => {
            if (e.channel == "devtools") {
                const devtoolsWindow = document.getElementById(`devtools_window_${id}`)
                
                if (devtoolsWindow.style.display == "block") {
                    disableDevTools(id)
                }
                else {
                    enableDevTools(id)
                }
            }
        })
    }

    //trash
    setTimeout(() => {
        if (!initiated) {
            init()
        }
    }, 10);

    return (
        <div id={`view_${id}`} className='view'>
            <div className='viewHost'>
                <webview id={`webview_${id}`} src={startpage} className='webview' preload='file://C:\Users\Liam\Documents\Git\hub\Pro\app\src\inject\com.js'/>
                <div id={`devtools_window_${id}`} className="devtoolsWindow">
                    <div className='devtoolsResizer'></div>
                    <webview className='devtools' id={`devtools_${id}`} src="about:blank"/>
                </div>
            </div>
        </div>
    )
}

export default View