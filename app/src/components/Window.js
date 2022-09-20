import React from 'react'
import { useState } from 'react'
import ViewContainer from './ViewContainer'
import events from '../events'
import { VscAdd } from "react-icons/vsc"
import Tab from "./Tab"

export default function Window({ options, spawn, despawn }) {
  const [tabs, setTabs] = useState({
    [Date.now()]: {
      id: Date.now(),
      visible: true,
      status: "loading"
    }
  })

  const [initiated, setInitiated] = useState(false)
  const [, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  let spawnMode

  //on drag start [emitted: newTab]
  function drag(e) {
    e.target.classList.add("drag")
    e.dataTransfer.setData('mode', "new"); 

    //emit event to all views to hide them
    events.emit("views-display", false)
  }

  //on drag end [emitted: newTab]
  function dragEnd(e) {
    e.target.classList.remove("drag")
  }

  //on drag over (port)
  function dragOver(e) {
    if (e.target.classList.contains("port")) {
      e.preventDefault()

      const preview = e.target.children[0]
      preview.style.opacity = 1
      preview.style.visibility = "visible"
    }
  }

  function dragLeave(e) {
    if (e.target.classList.contains("preview")) {
      e.preventDefault()

      const preview = e.target
      preview.style.opacity = 0
      preview.style.visibility = "hidden"
    }
  }

  //on drag over (preview)
  function updatePreview(e) {
    e.preventDefault()

    const port = e.target.parentNode
    const preview = e.target

    const rect = port.getBoundingClientRect();
    const xCenter = rect.left + (port.offsetWidth / 2)
    const yCenter = rect.top + (port.offsetHeight / 2)
    const marginX = port.offsetWidth / 4
    const marginY = port.offsetHeight / 4

    let dropMode

    if (e.clientY > (yCenter + marginY)) {
      dropMode = "bottom"
    }
    if (e.clientY < (yCenter - marginY)) {
      dropMode = "top"
    }

    if (e.clientX > (xCenter + marginX)) {
      dropMode = "right"
    }
    if (e.clientX < (xCenter - marginX)) {
      dropMode = "left"
    }

    if (!dropMode) {
      dropMode = "center"
    }

    if (false) {
      preview.innerHTML = `
      top: ${rect.top} left: ${rect.left}
      width: ${port.offsetWidth} height: ${port.offsetHeight}
      center: ${xCenter}
      <br/>
      mouse: X: ${e.clientX} Y: ${e.clientY}
      <br/>
      mode: ${dropMode}
    `
    }

    //reset
    preview.style.height = "100%"
    preview.style.width = "100%"
    preview.style.bottom = 0
    preview.style.left = 0
    preview.style.top = 0


    if (dropMode == "left") {
      preview.style.left = 0
      preview.style.width = "50%"
    }

    if (dropMode == "right") {
      preview.style.left = "50%"
      preview.style.width = "50%"
    }

    if (dropMode == "top") {
      preview.style.height = "50%"
      preview.style.bottom = "50%"
    }

    if (dropMode == "bottom") {
      preview.style.height = "50%"
      preview.style.top = "50%"
    }

    if (dropMode == "center") {
      preview.style.left = 0
      preview.style.width = "100%"
    }

    spawnMode = dropMode
  }

  //on drop (preview)
  function drop(e) {
    const dropMode = e.dataTransfer.getData("mode")

    resetPreview(e)
    
    if (dropMode == "tab") {
      dropTab(e)
    }
    if (dropMode == "new") {
      dropNew(e)
    }
  }

  function dropTab(e) {
    //check if window contains this tab
    const tabId = Number(e.dataTransfer.getData("id"))
    
    //check if the tab shall be used to the same window
    //if yes, end process
    if (tabs[tabId] != undefined && spawnMode == "center") {
      return
    }

    if (spawnMode == "center") {
      events.emit("tab-migrate", tabId)
      newTab(tabId)
    }

  }

  function dropNew(e) {
    //TODO: spawn mode center(new tab)
    if (spawnMode != "center") {
      spawn(e.target.parentElement.parentElement.parentElement.parentElement, spawnMode)
    }

    //display all views
    events.emit("views-display", true)
  }

  function resetPreview(e) {
    const preview = e.target
    preview.style.left = 0
    preview.style.width = "100%"
    preview.style.opacity = 0
    preview.style.visibility = "hidden"
  }

  //close this container
  function despawner() {
    const window = document.getElementById(options.id)

    despawn(window)
  }

  //update view status
  function updateView(id, key, value) {
    setTabs(current => {
      if (current[id] == undefined) {
        console.log("message from dead component", id, key, value);
        return current
      }

      current[id][key] = value

      return current
    })

    forceUpdate()
  }

  //add tab
  function newTab(id) {
    if (!id) {
      id = Date.now()
    }

    setTabs(current => {
      current[id] = { id: id }

      return current
    })

    forceUpdate()
  }

  //set tab to visible
  function setVisible(visibleId) {
    if (tabs[visibleId] == undefined) {
      return
    }

    events.emit("tab-focused", visibleId)

    setTabs(current => {
      if (tabs[visibleId] == undefined) {
        return current
      }

      for (const id in current) {
        current[id].visible = false
      }

      current[visibleId].visible = true

      return current
    })

    forceUpdate()
  }

  function closeTab(tab) {
    //check amount of open tabs
    const numTabs = Object.keys(tabs).length

    if (numTabs < 2) {
      console.log("closing window");
      despawner()
    }
    
    if (numTabs > 1) {
      //remove viewContainer
      setTabs(current => {
        let visibleTabAvailable

        //delete closing tab
        delete current[tab.id]

        //check if another tab is visible
        for (const id in current) {
          if (current[id].visible == true) {
            visibleTabAvailable = true
          }
        }

        //if not, make first tab visible (TODO: better selection of new tab)
        if (!visibleTabAvailable) {
          const keys = Object.keys(current)

          setVisible(keys[0])
        }

        return current
      })
    }

    //send signal to destroy linked view
    events.emit("view-remove", tab.id)
    events.emit("adjust-all")

    forceUpdate()
  }

  function migrateTab(id) {
    if (tabs[id] == undefined) {
      return
    }

    //check amount of open tabs
    const numTabs = Object.keys(tabs).length

    if (numTabs < 2) {
      console.log("closing window");
      despawner()
    }
    
    if (numTabs > 1) {
      //remove viewContainer
      setTabs(current => {
        let visibleTabAvailable

        //delete closing tab
        delete current[id]

        //check if another tab is visible
        for (const id in current) {
          if (current[id].visible == true) {
            visibleTabAvailable = true
          }
        }

        //if not, make first tab visible (TODO: better selection of new tab)
        if (!visibleTabAvailable) {
          const keys = Object.keys(current)

          setVisible(keys[0])
        }

        return current
      })
    }

    //force update
    forceUpdate()

    //adjust all views
    events.emit("adjust-all")

    //display all views
    events.emit("views-display", true)
  }
  
  function init() {
    if (initiated) {
      return
    }
    
    setInitiated(true)

    events.on("tab-migrate", migrateTab)
  }

  init()


  return (
    <div className='window' id={options.id} onDragEnter={dragOver}>
      <div className='head'>
        <div className='tabs'>
          {Object.values(tabs).map(tab => (
            <Tab key={tab.id} tab={tab} setVisible={setVisible} close={closeTab}/>
          ))}
          <div className='newTab' draggable="true" onDragStart={drag} onDragEnd={dragEnd} onClick={() => {newTab()}}>
            <VscAdd />
            <div>
              <p>New Tab</p>
            </div>
          </div>
        </div>
      </div>
      <div className='ports'>
        {Object.values(tabs).map(tab => (
          <div key={tab.id} className={`port ${String(tab.visible)}`} id={`port-${tab.id}`}>
            <div className="preview" onDragLeave={dragLeave} onDragOver={updatePreview} onDrop={drop}></div>
            <ViewContainer id={tab.id} visibility={tab.visible} update={updateView} setVisible={setVisible} />
          </div>
        ))}
      </div>
    </div>
  )
}
