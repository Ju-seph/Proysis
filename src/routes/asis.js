const ctl_asis = require("../controllers/ctl_asis");
const {isAuth,notAuth} = require("../helpers/auth")

module.exports = (app) => {

    app.get('/asistencia', isAuth, ctl_asis.asistencia);
    app.post('/asistencia', isAuth, ctl_asis.asistencia);

    app.get('/asistencia/:id/editar', isAuth, ctl_asis.mostrarFormularioEdicion);
    app.post('/editar-asistencia/:id/editar', isAuth, ctl_asis.editarAsistencia);

    app.post('/eliminar-asistencia/:id', isAuth, ctl_asis.eliminarAsistencia);

}