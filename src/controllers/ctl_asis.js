const Asistencia = require('../models/asistencia');
const User = require('../models/user');
const ctrl = {};


ctrl.asistencia = async (req, res) => {
    const user = await User.findOne({ "_id": req.session._id }).select("-password");
    const userId = req.session._id;
    if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
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

    res.render('auth/table.hbs', { registrosAsistencia, session: req.session, user });

}

ctrl.mostrarFormularioEdicion = async (req, res) => {
    try {
        const asistenciaId = req.params.id;

        // Verificar si la asistencia existe en la base de datos
        const asistencia = await Asistencia.findById(asistenciaId);
        if (!asistencia) {
            return res.status(404).json({ message: 'Asistencia no encontrada' });
        }

        // Renderizar el formulario de edición de asistencia con los datos de la asistencia
        res.render('auth/editar.hbs', { asistencia, session: req.session });
    } catch (error) {
        console.error('Error al mostrar el formulario de edición de asistencia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


ctrl.editarAsistencia = async (req, res) => {
    const asistenciaId = req.params.id;
    const { hora } = req.body;

    // Validar que la hora sea válida
    const fecha = new Date();
    fecha.setHours(parseInt(hora.split(":")[0])); // Obtener la hora
    fecha.setMinutes(parseInt(hora.split(":")[1])); // Obtener los minutos

    try {
        // Actualizar la asistencia con la nueva hora
        await Asistencia.findByIdAndUpdate(asistenciaId, { fecha });
        res.redirect('/asistencia'); // Redirigir a la página de asistencia después de editar
    } catch (error) {
        console.error('Error al editar la asistencia:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
}

ctrl.eliminarAsistencia = async (req, res) => {
    const asistenciaId = req.params.id;

    try {
        // Busca y elimina la asistencia por su ID
        await Asistencia.findByIdAndDelete(asistenciaId);
        res.redirect('/asistencia'); // Redirige a la página de asistencia después de eliminar
    } catch (error) {
        console.error('Error al eliminar la asistencia:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
}

module.exports = ctrl;