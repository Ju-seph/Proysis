const Asistencia = require('../models/asistencia');
const User = require('../models/user');

const ctl_asis = {};

ctl_asis.guardarget = async (req, res) => {
    
    
    const userId = req.session._id;

    // Verificar si el usuario está autenticado
    if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Buscar al usuario en la base de datos
    const usuario = await User.findById(userId);
    if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const asistencia = new Asistencia({
        user: userId,
        nombre: usuario.name,
        email: usuario.email,
        fecha: new Date()
    });

    let registrosAsistencia;

    if (usuario.rol === 'Administrador') {
        // Si el usuario es un administrador, obtener los registros de asistencia de usuarios que no son administradores
        registrosAsistencia = await Asistencia.find({ 'user': { $ne: userId }, 'rol': { $ne: 'Administrador' } });
    } else {
        // Si el usuario es un cliente, obtener solo sus propios registros de asistencia
        registrosAsistencia = await Asistencia.find({ 'user': userId });
    }
    // Renderizar la vista "asistencia" con los registros de asistencia obtenidos
    res.render('auth/table.hbs', { registrosAsistencia, session: req.session, User });
}

ctl_asis.guardarAsistencia = async (req, res) => {
    // Obtener el ID del usuario desde la sesión (suponiendo que esté almacenado en req.session._id)
    
    const userId = req.session._id;

    // Verificar si el usuario está autenticado
    if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Buscar al usuario en la base de datos
    const usuario = await User.findById(userId);
    if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const asistencia = new Asistencia({
        user: userId,
        nombre: usuario.name,
        email: usuario.email,
        fecha: new Date()
    });
    await asistencia.save();

    let registrosAsistencia;

    if (usuario.rol === 'Administrador') {
        // Si el usuario es un administrador, obtener los registros de asistencia de usuarios que no son administradores
        registrosAsistencia = await Asistencia.find({ 'user': { $ne: userId }, 'rol': { $ne: 'Administrador' } });
    } else {
        // Si el usuario es un cliente, obtener solo sus propios registros de asistencia
        registrosAsistencia = await Asistencia.find({ 'user': userId });
    }
    // Renderizar la vista "asistencia" con los registros de asistencia obtenidos
    res.render('auth/table.hbs', { registrosAsistencia, session: req.session, User });
}

module.exports = ctl_asis;