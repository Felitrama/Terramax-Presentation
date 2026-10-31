export const team = [
  ['Nicolás Gazzotti', '1163654'], ['Matias Paiz', '1192729'],
  ['Felipe Trama', '1161219'], ['Tomas Taffarel Zitelli', '1170412'],
];
export const slides = [
  {section:'Evaluación de Proyectos Informáticos — UADE',title:'TERRAMAX',speaker:'Nicolás',seconds:10,type:'cover'},
  {section:'Problema y oportunidad',title:'Del registro disperso\na una gestión integrada.',speaker:'Nicolás',seconds:35,type:'problem',items:[
    ['Información dispersa','Registros manuales, planillas y herramientas separadas.'],
    ['Seguimiento difícil','Menor claridad para seguir tratamientos y controles.'],
    ['Una base compartida','Información accesible para coordinar tareas y decidir.'],
  ]},
  {section:'Mercado y competencia',title:'Un mercado con\nalternativas existentes.',speaker:'Nicolás',seconds:40,type:'market'},
  {section:'Producto y propuesta de valor',title:'Una ficha por animal.\nUn seguimiento continuo.',speaker:'Matias',seconds:40,type:'product',items:[
    ['Registro del animal','Identificación individual y eventos del rodeo.'],
    ['Seguimiento sanitario','Vacunas, tratamientos y controles.'],
    ['Alertas y actividades','Calendario sanitario y avisos automáticos.'],
    ['Reportes y decisiones','Dashboard, estadísticas e informes.'],
  ]},
  {section:'Modelo de negocio',title:'Un servicio recurrente,\npor establecimiento.',speaker:'Matias',seconds:40,type:'business'},
  {section:'Equipo, desarrollo y aspectos legales',title:'Las capacidades necesarias\npara sostener el servicio.',speaker:'Felipe',seconds:40,type:'team'},
  {section:'Inversión y estructura de costos',title:'Invertir para desarrollar.\nFinanciar para operar.',speaker:'Felipe',seconds:50,type:'costs'},
  {section:'Proyección financiera',title:'Ingresos recurrentes.\nCapital necesario al inicio.',speaker:'Tomas',seconds:55,type:'finance'},
  {section:'Riesgos, salida y conclusión',title:'Una oportunidad que\nnecesita validación.',speaker:'Tomas',seconds:45,type:'closing'},
  {section:'Cierre y preguntas',title:'Gracias. ¿Preguntas?',speaker:'Tomas',seconds:5,type:'farewell'},
];
export const investment = [['Desarrollo del MVP',8.5],['Pruebas y seguridad',1],['Equipamiento',1],['Nube, licencias y herramientas',1],['Material de lanzamiento',0.5]];
export const finance = [
  {year:'Año 1',clients:8,revenue:14.4,operating:-2.52,total:-14.52,equilibrium:10},
  {year:'Año 2',clients:25,revenue:45,operating:18.6,total:18.6,equilibrium:14},
  {year:'Año 3',clients:55,revenue:99,operating:58.8,total:58.8,equilibrium:18},
];
export const number = (value, digits=1) => value.toLocaleString('es-AR',{minimumFractionDigits:digits,maximumFractionDigits:digits});
