class ConsoleWidgets {
    actionsList = []
    metricList = []
    portList = []
        
    /**
     * Добавление объекта метрики
     * 
     * 
    */
    addMetrics(MetricObject){
        this.metricList.push(MetricObject)
    }

    /**
     * Добавление экшена
     * 
     * 
     * @param {string} service
     * @param {string} device
     * @param {string} action
     * @param {Object} deviceStruct 
    */
    addAction(service, device, action, deviceStruct ){
        this.actionsList.push({ id: this.makeId(), service, device, action, deviceStruct })
    }

    /**
     * Добавление порта
     * 
     * Если тип порта output - захват порта
     * Если тип порта input - Push порта
     * 
     * @param {string} service
     * @param {string} device 
     * @param {string} port
     * @param {string} type input/output
    */
    addPort(service, device, port, type){
        this.portList.push({id: this.makeId(), service, device, port, type})
    }

    /**
     * Генерирует уникальный идентификатор строковый
    */
    makeId(length = 14) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length); result += chars[randomIndex];
        }
        return result;
    }

    /**
     * Удаляет экшен
    */
    removeAction(id){
        this.remoteElement(id, 'actionsList')
    }     

    /**
     * Удаляет метрику
    */
    removeMetric(id){
        this.remoteElement(id, 'metricList')
    }

    /**
     * Удаляет порт
    */
    removePort(id) {
        this.remoteElement(id, 'portList')
    }

    /**
     * 
     * @private
    */
    remoteElement(id, list){
        for (let i = 0; i < this[list].length; i++) if (this[list][i].id === id) this[list].splice(i,1) 
    }
}

exports.ConsoleWidgets = new ConsoleWidgets()