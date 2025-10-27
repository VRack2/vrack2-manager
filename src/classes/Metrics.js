import { ConsoleWidgets } from "./ConsoleWidgets"

const colors_arr = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
]

export class Metrics {
    metricList = []

    id = ''
    name = ''
    service = ''
    device = ''
    unit = ''
    command = 'serviceDeviceMetric'
    
    constructor(name){
        this.id = ConsoleWidgets.makeId()
        this.name = name
    }
    
    setService(service, device){
        this.service = service
        this.device = device
        return this
    }

    setCommand(command){
        this.command = command
        return this
    }

    addMetric(service, device, metric, color ){
        if (!color) color = colors_arr[this.metricList.length]
        this.metricList.push({ id: ConsoleWidgets.makeId(), service, device, metric, color })
        return this
    }

    clearList(){
        this.metricList.splice(0, this.metricList.length)
        return this
    }

    setUnit(unit){
        this.unit = unit
        return this
    }

    /**
     * @param {Metrics} Metric 
    */
    import(Metrics){
        for (const met of Metrics.metricList)this.metricList.push(met)
        return this
    }
}



export class MetricsControl{
    activePeriod = 'now-6h:now'
    activeTimer = 15000
    activeVAlign = 1
    size = 'middle'
    sizeList = { small: 'chart-sm', middle: 'chart-md', large: 'chart-lg' }

    periodPreset = {
        "now-5m:now": "5  Минут",
        "now-15m:now": "15 Минут",
        "now-30m:now": "30 Минут",
        "now-1h:now": "1 Час",
        "now-3h:now": "3 Часа",
        "now-6h:now": "6 Часов",
        "now-24h:now": "1 День",
        "now-2d:now": "2 Дня",
        "now-7d:now": "7 Дней",
        "now-1mon:now": "1 Месяц",
        "now-6mon:now": "6 Месяцев",
        "now-1y:now": "1 Год",
        "start:end": "Все время",
    };

    timerPreset = {
        5000: '5 Сек',
        15000: '15 Сек',
        30000: '30 Сек',
        60000: '1 Мин',
        300000: '5 мин'
    }

    vAlign = {
        1: 'от 0',
        2: 'Min-Max',
    }



    index = []

    timer = false

    start(){
        this.updateTimer()
    }

    stop(){
        if (this.timer) clearInterval(this.timer)
    }

    setSize(nsize){
        if (!this.sizeList[nsize]) return
        this.size = nsize
    }

    setPerionPreset(preset){
        this.activePeriod = preset
        this.updateIndex()
    }

    setTimerPreset(preset){
        this.activeTimer = parseInt(preset)
        this.updateTimer()
        this.updateIndex()
    }

    setVAlign(preset){
        this.activeVAlign = parseInt(preset)
        this.updateIndex()
    }

    updateIndex(){
        if (this.index.length) this.index.pop()
        else this.index.push(this.index)
        // this.index.pop()
    }

    updateTimer(){
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(()=>{

            this.updateIndex()
        }, this.activeTimer)
    }
}