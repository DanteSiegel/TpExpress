class ValidacionesHelper {
    /**
Este método recibe un 'value', e intenta convertirlo a un número entero,
* si por alguna razón falla retorna el 'defaultValue', sino el valor
* numérico entero del parámetro 'value'.
      @param {*} value  valor a verificar.
      @param {*} defaultValue valor por default en el caso de que 'value' no

     
      @returns  Un número entero.
      
     */
    getIntegerOrDefault = (value, defaultValue) => {
      const parsedValue = parseInt(value, 10);
      return isNaN(parsedValue) ? defaultValue : parsedValue;
    };
  
    /**
     * Este método recibe un 'value', en el caso de que sea undefined o null
     * retorna el 'defaultValue', sino el valor del parámetro 'value'.
     * @param {*} value valor a verificar.
     * @param {*} defaultValue valor por default en el caso de que 'value' sea
     * undefined o null.
     * @returns Una cadena de texto.
     */
    getStringOrDefault = (value, defaultValue) => {
      return value === undefined || value === null ? defaultValue : value.toString();
    };
  }
  
  export default new ValidacionesHelper();
  