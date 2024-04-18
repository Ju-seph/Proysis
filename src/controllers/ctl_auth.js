const User = require("../models/user");
const ctrl = {};
const mongoose = require("mongoose")



ctrl.eliminarUsuario = async (req, res) => {
    try {
        const userId = req.params.id; 

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('ID de usuario inválido');
        }

        const usuario = await User.findByIdAndDelete(userId);

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.redirect('/auth/table');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).send('Error interno del servidor al eliminar usuario');
    }
};


ctrl.editarUsuario = async (req, res) => {
    try {
        const userId = req.params.id; 

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('ID de usuario inválido');
        }

        const usuario = await User.findById(userId);

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.render('notas/editar_usuario.hbs', { usuario });
    } catch (error) {
        console.error('Error al editar usuario:', error);
        res.status(500).send('Error interno del servidor al editar usuario');
    }
};

ctrl.actualizarUsuario = async (req, res) => {
    try {
        const userId = req.params.id; 


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('ID de usuario inválido');
        }
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

        res.redirect('/auth/table');
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send('Error interno del servidor al actualizar usuario');
    }
};





ctrl.login = (req, res) => {
    res.render("auth/login.hbs");
};


ctrl.ingresar = async (req, res) => {

    const { email, password } = req.body
    const errores = [];

    const existe = await User.findOne({ "email": email });

    if (!existe) {
        errores.push({ text: "Usuario o clave Incorrecto" });
    } else {
        if (!(await existe.matchPassword(password))) {
            errores.push({ text: "Clave Incorrecta" });
        }
    }

    if (errores.length > 0) {
        res.render("auth/login.hbs", { error_msg: errores })
    } else {
        req.session._id = existe._id;
        req.session.rol = existe.rol;
        res.redirect("/principal")
    }

}



ctrl.registro = (req, res) => {
    res.render("auth/registro.hbs");
}

ctrl.guardar = async (req, res) => {

    const { name, email, password, confirm_password } = req.body;
    const errores = [];

    if (name == "" || email == "" || password == "" || confirm_password == "") {
        errores.push({ text: "Campos Incompletos" });
    }
    if (password != confirm_password) {
        errores.push({ text: "Las claves no coinciden" });
    }

    const existe = await User.findOne({ "email": email });
    if (existe) {
        errores.push({ text: "El usuario ya existe" });
    }

    if (errores.length > 0) {
        res.render("auth/registro.hbs", { error_msg: errores, datos: req.body });
    } else {
        const usuario = new User({
            name,
            email,
            password,
            rol: "Cliente"
        });
        usuario.password = await usuario.encryptPassword(password);
        await usuario.save();
        res.render("auth/registro.hbs", { success_msg: "Cliente Creado Correctamente" });
    }

}


ctrl.salir = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

module.exports = ctrl;