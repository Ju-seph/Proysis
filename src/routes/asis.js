const ctl_asis = require("../controllers/ctl_asis");
const { isAuth, notAuth } = require("../helpers/auth");

module.exports = (app) => {
    
    app.get('/asistencia2', isAuth, ctl_asis.guardarget);
    app.post('/asistencia', isAuth, ctl_asis.guardarAsistencia);
}

