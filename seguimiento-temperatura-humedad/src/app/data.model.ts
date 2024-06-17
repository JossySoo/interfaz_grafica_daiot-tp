export interface TimestampObject {
    value: string;
  }
  
  export interface SensorData {
    dev_id: string;
    propietario: string;
    tiempo_registro: TimestampObject;
    temperatura: number;
    humedad: number;
  }