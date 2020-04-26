namespace cpp tutorial

struct State{
  1: bool alive,
  2: bool processing
}

exception Exception {
  1: string what,
  2: string why
}

exception EventInPastException {
  1: i64 timestamp,
}

service Reflection{
  void ping(),
  string inspect(1: string id),
  list<string> listAppliances(),
}

service idIOT extends Reflection {
   State getState(1: string id),
   bool on(),
   bool off(),
}

enum TemperatureScale{
  CELSIUS=1,
  KELVIN=2,
  FAHRENHEIT=3
}

service idIOT_read_temperature extends idIOT{
  i32 measureTemperature(1: string id, 2: TemperatureScale ts) throws (1:Exception deviceNotSupportedEx);
}

service idIOT_read_set_temperature extends idIOT_read_temperature{
  i32 setTemperature(1: string id,2: TemperatureScale ts, 3: i32 temp) throws (1:Exception deviceNotSupportedEx); 
}

service idIOT_runnable extends idIOT{
  i32 scheduleRun(1: string id,2: i64 timestamp) throws (1: EventInPastException pastTimeEx);
  bool runNow(1: string id) throws (1: Exception deviceBrokeEx);
}