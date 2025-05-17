class ConsoleWidgets {
    actionsList = []
    metricList = []

    addMetrics(MetricObject){
        this.metricList.push(MetricObject)
    }

    /***/
    addAction(service, device, action, deviceStruct ){
        this.actionsList.push({ id: this.makeId(), service, device, action, deviceStruct })
    }

    makeId(length = 14) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length); result += chars[randomIndex];
        }
        return result;
    }

    removeAction(id){
        for (let i = 0; i < this.actionsList.length; i++) if (this.actionsList[i].id === id) this.actionsList.splice(i,1) 
    }     

    removeMetric(id){
        for (let i = 0; i < this.metricList.length; i++) if (this.metricList[i].id === id) this.metricList.splice(i,1) 
    }     
}

exports.ConsoleWidgets = new ConsoleWidgets()