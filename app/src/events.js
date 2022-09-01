const listeners = {}

const events = {
    emit: (identifier, data) => {
        const e = new CustomEvent(identifier, {detail: data});
    
        document.dispatchEvent(e)
    },
    emitOn: ($, identifier, data) => {
        const e = new CustomEvent(identifier, {detail: data});
        
        $.dispatchEvent(e)
    },
    on: (identifier, func, opt) => {
        if (opt) {
            if (opt.dublicates == false) {
                if (listeners[identifier] != undefined) {
                    return
                }
            }
        }

        listeners[identifier] = true
        
        document.addEventListener(identifier, e => {
            func(e.detail)
        })
    }
}

export default events;