import React from 'react'
import events from '../events'
import { useState, useEffect } from 'react';

function ViewContainer({ id, visibility, update, setVisible }) {
    const [classes, setClassses] = useState("active")
    const [setup, setSetup] = useState(false)


    function init() {
        setTimeout(() => {
            events.emit("view-create", id)
            console.log("creating view");
        }, 10);
    
        events.on(`${id}-ready`, () => {
            const webview = document.getElementById(`webview_${id}`)
            
            //listen for favicon
            webview.addEventListener("page-favicon-updated", e => {
                update(id, "favicon", e.favicons[0])
            })

            //listen for loadstart
            webview.addEventListener("did-start-loading", () => {
                update(id, "status", "loading")
            })

            webview.addEventListener("load-commit", () => {
                update(id, "status", "commit")
            })

            //listen for load ready
            webview.addEventListener("did-stop-loading", () => {
                let title = webview.getTitle()

                if (title.length > 20) {
                    title = title.slice(0, 20) + "..."
                }
                
                console.log("idle");

                update(id, "title", title)
                update(id, "status", "idle")
            })

            //listen for interactions (com.js)
            console.log("ja");

            webview.addEventListener("ipc-message", e => {
                if (e.channel == "interact") {
                    setVisible(id)
                }
            })

            //initial values
            let title = webview.getTitle()

            if (title.length > 20) {
                title = title.slice(0, 20) + "..."
            }

            update(id, "title", title)
            update(id, "status", "idle")
            
            setVisible(id)
        })
    }

    //on component update
    useEffect(() => {
        if (visibility == true) {
            setClassses("active")
        }
        else {
            setClassses("inactive")
        }

        if (!setup) {
            setSetup(true)
            init()
        }
        
    });

    return (
        <div className={`viewContainer ${classes}`} id={`container_${id}`} >
            <p>ViewContainer {id}</p>
            <p>Visibility {String(visibility)}</p>
        </div>
    )
}

export default ViewContainer