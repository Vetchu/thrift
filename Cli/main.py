import sys
import glob

sys.path.append('gen-py')
sys.path.insert(0, glob.glob('gen-py/tutorial')[0])

from tutorial import idIOT_runnable
from tutorial import idIOT_read_temperature
from tutorial import idIOT_read_set_temperature

# from tutorial import Calculator

from tutorial.ttypes import TemperatureScale
from tutorial.ttypes import Exception

from thrift import Thrift
from thrift.TMultiplexedProcessor import TMultiplexedProtocol
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol


def main():
    # Make socket
    transport = TSocket.TSocket('localhost', 9090)

    # Buffering is critical. Raw sockets are very slow
    transport = TTransport.TBufferedTransport(transport)

    # Wrap in a protocol
    protocol = TBinaryProtocol.TBinaryProtocol(transport)

    mp = TMultiplexedProtocol.TMultiplexedProtocol(protocol, "runnableSvc")
    runnable_client = idIOT_runnable.Client(mp)
    mp2 = TMultiplexedProtocol.TMultiplexedProtocol(protocol, "readTempSvc")
    temp_read_client = idIOT_read_temperature.Client(mp2)
    mp3 = TMultiplexedProtocol.TMultiplexedProtocol(protocol, "readSetTempSvc")
    temp_all_client = idIOT_read_set_temperature.Client(mp3)

    # Connect!
    transport.open()

    print(runnable_client.getState("fridge"))
    mower_result = runnable_client.runNow("mower")
    print("run first time mower returned ", mower_result)
    mower_result = runnable_client.runNow("mower")
    print("run second time mower returned ", mower_result)
    mower_result = runnable_client.runNow("mower")
    print("run third time mower returned ", mower_result)

    appliances = runnable_client.listAppliances()
    print(appliances)

    status = runnable_client.inspect("fridge")
    print(status)

    print("testing fridge {")
    temp = temp_read_client.measureTemperature("fridge", TemperatureScale.CELSIUS)
    print("current temp in CELSIUS:", temp)
    temp = temp_read_client.measureTemperature("fridge", TemperatureScale.KELVIN)
    print("current temp in KELVIN:", temp)
    temp = temp_read_client.measureTemperature("fridge", TemperatureScale.FAHRENHEIT)
    print("current temp in FAHRENHEIT:", temp)
    print("}")
    newtemp = 30
    print("setting temperature of fridge to:", newtemp)
    temp = temp_all_client.setTemperature("fridge", TemperatureScale.CELSIUS, newtemp)
    print("temperature of fridge set to:", temp)
    temp = temp_read_client.measureTemperature("fridge", TemperatureScale.CELSIUS)
    print("current fridge temp in CELSIUS:", temp)
    temp = temp_read_client.measureTemperature("fridge", TemperatureScale.FAHRENHEIT)
    print("current fridge temp in FAHRENHEIT:", temp)

    try:
        temp = temp_read_client.measureTemperature("mower", TemperatureScale.CELSIUS)
        print("current fridge temp in CELSIUS:", temp)
    except Exception as ex:
        print("caught exception", ex)

    temp = temp_read_client.listAppliances()
    print("current objects:", temp)

    try:
        temp = temp_read_client.measureTemperature("oof", TemperatureScale.CELSIUS)
        print("current fridge temp in CELSIUS:", temp)
    except Exception as ex:
        print("caught exception", ex)
    # Close!
    transport.close()


main()
