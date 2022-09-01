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

  const [, updateState] = useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  let spawnMode

  //on drag start [emitted: newTab]
  function drag(e) {
    e.target.classList.add("drag")
    e.target.innerHTML = "New Tab"

    //emit event to all views to hide them
    events.emit("views-display", false)
  }

  //on drag end [emitted: newTab]
  function dragEnd(e) {
    e.target.classList.remove("drag")
    e.target.innerHTML = "+"
  }

  //on drag over (port)
  function dragOver(e) {
    console.log("dragOver");
    console.log(e.target);

    if (e.target.classList.contains("port")) {
      e.preventDefault()

      const preview = e.target.children[0]
      console.log(e.target);
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
    console.log("preview");
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
    const preview = e.target
    preview.style.left = 0
    preview.style.width = "100%"
    preview.style.opacity = 0
    preview.style.visibility = "hidden"

    //TODO: spawn mode center(new tab)
    if (spawnMode != "center") {
      spawn(e.target.parentElement.parentElement.parentElement.parentElement, spawnMode)
    }

    //display all views
    events.emit("views-display", true)
  }

  //close this container
  function despawner() {
    const window = document.getElementById(options.id)

    despawn(window)
  }

  //update view status
  function updateView(id, key, value) {
    setTabs(current => {
      current[id][key] = value

      return current
    })

    forceUpdate()
  }

  //add tab
  function newTab() {
    setTabs(current => {
      current[Date.now()] = { id: Date.now() }

      return current
    })

    forceUpdate()
  }

  //set tab to visible
  function setVisible(visibleId) {
    events.emit("tab-focused", visibleId)

    setTabs(current => {
      for (const id in current) {
        current[id].visible = false
      }

      current[visibleId].visible = true

      return current
    })

    forceUpdate()
  }

  function onTabClick(e) {
    console.log(e);
  }





  return (
    <div className='window' id={options.id} onDragEnter={dragOver}>
      <div className='head'>
        <div className='tabs'>
          {Object.values(tabs).map(tab => (
            <Tab key={tab.id} tab={tab} setVisible={setVisible}/>
          ))}
          <div className='newTab' draggable="true" onDragStart={drag} onDragEnd={dragEnd} onClick={newTab}>
            <VscAdd />
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
