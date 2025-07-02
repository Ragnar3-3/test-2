# Aplicación de Lista de Tareas con Vista de Calendario

## Descripción General

Esta aplicación web es una herramienta de gestión de tareas con vista de calendario, diseñada para ayudar a los usuarios a organizar sus actividades diarias. La aplicación permite crear, editar y eliminar tareas, así como visualizarlas en un calendario interactivo.

## Estructura de la Aplicación

La aplicación consta de dos páginas principales:

1. **Página Principal (index.html)**: Muestra la lista de tareas con opciones para añadir, editar, eliminar y filtrar tareas.
2. **Página de Calendario (calendar.html)**: Presenta las tareas en un formato de calendario mensual, permitiendo navegar entre meses y ver las tareas programadas para cada día.

## Funcionalidades Principales

### Gestión de Tareas

- **Añadir Tareas**: Los usuarios pueden añadir nuevas tareas especificando un texto descriptivo y una fecha.
- **Editar Tareas**: Permite modificar el texto y la fecha de las tareas existentes.
- **Eliminar Tareas**: Posibilidad de eliminar tareas que ya no son necesarias.
- **Marcar como Completadas**: Las tareas pueden marcarse como completadas, lo que cambia su apariencia visual.
- **Filtrar Tareas**: Las tareas pueden filtrarse por estado (todas, pendientes, completadas).
- **Estadísticas**: Muestra el número de tareas pendientes y completadas.

### Visualización en Calendario

- **Navegación Mensual**: Permite navegar entre diferentes meses.
- **Indicadores de Tareas**: Los días con tareas programadas muestran un indicador con el número de tareas.
- **Selección de Días**: Al hacer clic en un día, se muestran las tareas programadas para ese día.
- **Distinción Visual**: El día actual se resalta visualmente en el calendario.

## Características Técnicas

- **Almacenamiento Local**: Las tareas se guardan en el localStorage del navegador, lo que permite que persistan entre sesiones.
- **Diseño Responsivo**: La aplicación se adapta a diferentes tamaños de pantalla.
- **Interfaz Moderna**: Diseño limpio y moderno con transiciones suaves y botones redondeados.
- **Iconografía**: Utiliza Font Awesome para los iconos, mejorando la experiencia visual.

## Cómo Usar la Aplicación

1. **Añadir una Tarea**:
   - En la página principal, escribe el texto de la tarea en el campo de entrada.
   - Selecciona una fecha en el selector de fecha.
   - Haz clic en el botón "Añadir".

2. **Gestionar Tareas**:
   - Marca la casilla junto a una tarea para completarla.
   - Utiliza el botón de edición (ícono de lápiz) para modificar una tarea.
   - Utiliza el botón de eliminación (ícono de papelera) para eliminar una tarea.
   - Usa los botones de filtro para ver todas las tareas, solo las pendientes o solo las completadas.

3. **Ver Tareas en el Calendario**:
   - Haz clic en "Ver Calendario" para ir a la vista de calendario.
   - Navega entre meses usando los botones de flecha.
   - Haz clic en un día para ver las tareas programadas para ese día.
   - Desde la vista de calendario, también puedes marcar tareas como completadas, editarlas o eliminarlas.

## Aspectos Destacados del Código

- **Modularidad**: El código está organizado en funciones específicas para cada funcionalidad.
- **Manipulación del DOM**: Uso eficiente de JavaScript para crear y manipular elementos del DOM.
- **Gestión de Eventos**: Implementación de event listeners para manejar las interacciones del usuario.
- **Formateo de Fechas**: Funciones específicas para formatear fechas en diferentes formatos según sea necesario.

## Desarrolladores

Esta aplicación fue desarrollada por:
- Gabriel de Jesús Cornejo Luna
- Joel Zavala Duran
- Adiana Noemi Pech Cauich
