const thrift = require("thrift");
const ttypes = require("../gen-nodejs/tutorial_types");

const ReadTemp = require("../gen-nodejs/idIOT_read_temperature");
const ReadSetTemp = require("../gen-nodejs/idIOT_read_set_temperature")
const Runnable = require("../gen-nodejs/idIOT_runnable")
const Reflection = require("../gen-nodejs/Reflection")

const port = 9090

const IReflect = {
    inspect: function (id, result) {
        const operation = id + " inspect"
        console.log(operation)
        const obj = existingAppliances[id]

        if (!obj) {
            result(new ttypes.Exception(deviceUnsupportedExTemplate(operation)), "welp")
            return
        }
        result(null, JSON.stringify(Object.keys(existingAppliances[id])))
    },

    listAppliances: function (result) {
        result(null, Object.keys(existingAppliances));
    },

    ping: function (result) {
        console.log("ping()");
        result(null);
    },
};
const _IBase = {
    on: function (id, result) {
        const obj = existingAppliances[id];
        if (!obj) {
            result(new ttypes.Exception(deviceUnsupportedExTemplate(operation)), "welp")
            return
        }

        obj.alive
            ? result(null, false)
            : obj.alive = on
        result(null, true)
    },
    off: function (id, result) {
        const obj = existingAppliances[id];
        if (!obj) {
            result(new ttypes.Exception(deviceUnsupportedExTemplate(operation)), "welp")
            return
        }
        obj.alive
            ? obj.alive = false
            : result(false)
        result(null, true)
    },
    getState: function (id, result) {
        const obj = existingAppliances[id];
        if (!obj) {
            result(new ttypes.Exception(deviceUnsupportedExTemplate(operation)), "welp")
            return
        }
        const state = new ttypes.State(obj);
        result(null, state)
    },
    ...IReflect
};
const IRunnable = {
    runNow: function (id, result) {
        const operation = id + " runNow"
        console.log(operation)
        const obj = existingAppliances[id];
        if (!obj || !Object.keys(obj.this_interface).includes("runNow")) {
            result(new ttypes.Exception(deviceUnsupportedExTemplate(operation)), "welp")
            return
        }
        if (obj.processing) {
            console.log("Already processing! Return false")
            result(null, false)
        } else {
            console.log("Begin processing, it will take 5 seconds")
            obj.processing = true
            setTimeout(() => {
                console.log("finished processing " + id)
                obj.processing = false
            }, 5000)
            result(null, true)
        }
    },
    scheduleRun: function (id, timestamp, result) {
        const operation = id + " scheduleRun"
        console.log(operation)
        const obj = existingAppliances[id];
        if (!obj || !Object.keys(obj.this_interface).includes("scheduleRun")) {
            result(new ttypes.Exception(deviceUnsupportedExTemplate(operation)), "welp")
            return
        }
        setTimeout(() => {
            console.log("finished processing " + id)
            obj.processing = false
        }, timestamp - Date.now())
        result(null, true)
    },
    ..._IBase
};
const IReadTemp = {
    measureTemperature: function (id, scale_type, result) {
        const operation = id + " measureTemperature"
        console.log(operation)
        const obj = existingAppliances[id];

        if (!obj || !Object.keys(obj.this_interface).includes("measureTemperature")) {
            result(new ttypes.Exception(deviceUnsupportedExTemplate(operation)), "welp")
            return
        }
        const measValue = obj.this_interface.temperature
        let retValue;
        switch (scale_type) {
            case ttypes.TemperatureScale.CELSIUS:
                retValue = measValue;
                break;
            case ttypes.TemperatureScale.FAHRENHEIT:
                retValue = measValue * 9 / 5 + 32
                break;
            case ttypes.TemperatureScale.KELVIN:
                retValue = measValue + 273.15
                break;
            default:
                break;
        }
        result(null, retValue)
    },
    temperature: NaN,
    ..._IBase
};
const IReadSetTemp = {
    setTemperature: function (id, scale_type, target_temp, result) {
        const operation = id + " setTemperature"
        console.log(operation)

        const obj = existingAppliances[id];
        if (!obj || !Object.keys(obj.this_interface).includes("setTemperature")) {
            result(new ttypes.Exception(deviceUnsupportedExTemplate(operation)), "welp")
            return
        }

        let targetValue;
        switch (scale_type) {
            case ttypes.TemperatureScale.CELSIUS:
                targetValue = target_temp;
                break;
            case ttypes.TemperatureScale.FAHRENHEIT:
                targetValue = target_temp * 9 / 5 + 32
                break;
            case ttypes.TemperatureScale.KELVIN:
                targetValue = target_temp + 273.15
                break;
            default:
                break;
        }
        obj.this_interface.temperature = targetValue
        result(null, targetValue)
    },
    ...IReadTemp
};

const existingAppliances = {
    fridge: new Appliance("fridge", true, false, IReadSetTemp),
    oven: new Appliance("oven", true, false, IReadSetTemp),
    thermometer: new Appliance("thermometer", true, false, IReadTemp),
    mower: new Appliance("mower", true, false, IRunnable),
    vacuum: new Appliance("vacuum", true, false, IRunnable)
};

function deviceUnsupportedExTemplate(operation) {
    return {
        what: operation + " unsupported",
        why: "Device unsupported"
    }
}

function Appliance(type, alive, processing, this_interface) {
    this.type = type;
    this.alive = alive;
    this.processing = processing;
    this.this_interface = this_interface
    return this;
}

function init() {
    let processor = new thrift.MultiplexedProcessor()
    processor.registerProcessor("locatorSvc",
        new Reflection.Processor(IReflect)
    )
    processor.registerProcessor("runnableSvc",
        new Runnable.Processor(IRunnable)
    )
    processor.registerProcessor("readTempSvc",
        new ReadTemp.Processor(IReadTemp)
    )
    processor.registerProcessor("readSetTempSvc",
        new ReadSetTemp.Processor(IReadSetTemp)
    )
    thrift.createMultiplexServer(processor)
        .on("error", e => console.log(e))
        .listen(port);

    console.log("server started");

    (() => {
            for (const appliance_name in existingAppliances) {
                let appliance = existingAppliances[appliance_name]
                if (Object.keys(appliance.this_interface).includes("temperature")) {
                    appliance.this_interface.temperature = parseInt(Math.random() * 100)
                    console.log("Setting initial " + appliance.type + " temperature to " + appliance.this_interface.temperature)
                }
            }
        }
    )()
}

init();