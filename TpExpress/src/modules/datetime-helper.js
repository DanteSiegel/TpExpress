export default class DateTimeHelper {
  isDate = (fecha) => {
    const date = new Date(fecha);
    return !isNaN(date) && date instanceof Date;
  };

  getEdadActual = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesHoy = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();
    if (mesNacimiento > mesHoy || (mesNacimiento === mesHoy && nacimiento.getDate() > hoy.getDate())) {
      edad--;
    }
    return edad;
  };

  getDiasHastaMiCumple = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    nacimiento.setFullYear(hoy.getFullYear());
    const unDia = 1000 * 60 * 60 * 24;
    const diasParaCumple = Math.ceil((nacimiento.getTime() - hoy.getTime()) / unDia);
    return diasParaCumple >= 0 ? diasParaCumple : 365 + diasParaCumple;
  };

  getDiaTexto = (fecha, retornarAbreviacion = false) => {
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const indexDia = new Date(fecha).getDay();
    return retornarAbreviacion ? diasSemana[indexDia].substring(0, 3) : diasSemana[indexDia];
  };

  getMesTexto = (fecha, retornarAbreviacion = false) => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const indexMes = new Date(fecha).getMonth();
    return retornarAbreviacion ? meses[indexMes].substring(0, 3) : meses[indexMes];
  };
}
