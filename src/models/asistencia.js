const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },

});

const Asistencia = mongoose.model('Asistencia', asistenciaSchema);

module.exports = Asistencia;
