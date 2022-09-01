import React from 'react'

function tab({ tab, setVisible }) {
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

    init()

    return (
        <div className={`tab ${String(tab.visible)}`} key={tab.id} onClick={() => {setVisible(tab.id)}}>
            <div className='icon'>
                {tab.icon}
            </div>
            <div className='title'>
                <p>{tab.title}</p>
            </div>
        </div>
    )
}

export default tab