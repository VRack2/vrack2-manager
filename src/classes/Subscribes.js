

class Subscribes {
    /**
     * Все сообщения
    */
    messages = []

    /**
     * Все shares данные
    */

    shares = {}
    /**
     * Зарегистрированные каналы
    */
    registered = []
    
    /**
     * Список render каналов 
     * дублирует днные из registered только для рендер каналов
    */
    render = []
    
    remote  = {}
    index = 1000;
    setRemote(remote){
        this.remote = remote
    }

    /**
     * Регистрация канала
     * 
     * @param {string} service
     * @param {string} device
     * @param {string} target 
     * @param {Object} config 
    */
    registerChannel(service, device, target, config){
        if (!this.remote.connected) return this.clearAll()
        if (this.searchRegistered(service, device, target)) return
        this.remote.channelJoin(this.makeChannel(service,device,target), (data)=>{
            if (target === 'render') this.addShares(service, device, data)
            else this.addEvent(service, device,target,data)
        })
        if (target === 'render')this.render.push({ service, device })
        this.registered.push({ service, device, target, config})
    }

    /**
     * Регистрация канала
     * 
     * @param {string} device
     * @param {string} channel 
     * @param {Object} config 
    */
    unRegisterChannel(service, device, target){
        if (!this.remote.connected) return this.clearAll()
        for (let i = 0; i< this.registered.length; i++){
            const reg = this.registered[i]
            if (reg.service !== service || reg.device !== device || reg.target !== target) continue
            this.remote.channelLeave(this.makeChannel(service, device, target))
            this.registered.splice(i, 1)
        }
        if (target === 'render') this.deleteShares(service, device)
    }

    getDeviceRegistered(service, device){
        const result = []
        for (const reg of this.registered)
            if (reg.service === service && reg.device === device) result.push(reg)
        return result
    }

    searchRegistered(service, device, target){
        for (const reg of this.registered) 
            if (reg.service === service && reg.device === device && reg.target === target) 
                return reg
        return false
    }

    addEvent(service, device,target,data){
        this.messages.push({id: this.index++,service, device,target,data, timestamp: Date.now()})
        if (this.messages.length > 100 ) this.messages.shift()
    }

    addShares(service, device, data){
        if (!this.shares[service]) this.shares[service] = {}
        if (!this.shares[service][device]) this.shares[service][device] = {}
        this.shares[service][device] = data.data
    }

    deleteShares(service, device){
        if (!this.shares[service] || !this.shares[service][device]) return    
        delete this.shares[service][device]
        for (let i = 0; i< this.render.length; i++){
            const re = this.render[i]
            if (re.service !== service || re.device !== device ) continue
            this.render.splice(i, 1)
        }
    }

    /**
     * Удаляет информацию о всех каналах
     * 
    */
    clearAll(){
        this.registered = []
    }

        /**
     * Make broadcast channel name
     * 
     * @param device DeviceID
     * @param target Specific channel of device
    */
    makeChannel(service, device, channel) {
        return ['services', service, 'devices', device, channel].join('.')
    }
}

exports.Subscribes = new Subscribes()