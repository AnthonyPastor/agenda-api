const Evento = require('../models/Evento');

const getEventos = async (req, res) => {

    const eventos = await Evento.find().populate('user', 'name');

    return res.status(200).json({
        ok: true,
        eventos
    })
};


const crearEvento = async (req, res) => {

    try {
        const evento = new Evento(req.body);

        evento.user = req.uid;

        await evento.save();

        return res.status(200).json({
            ok: true,
            evento
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            evento: null
        });
    }

}

const actualizarEvento = async (req, res) => {

    try {
        const evento = await Evento.findById(req.params.id);

        if (!evento) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el evento especificado'
            });
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            });
        }

        const nuevoEvento = { ...req.body, user: req.uid }

        const eventoActualizado = await Evento.findByIdAndUpdate(req.params.id, nuevoEvento, { new: true });

        return res.status(200).json({
            ok: true,
            evento: eventoActualizado
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            evento: null
        });
    }
}

const eliminarEvento = async (req, res) => {

    try {
        const evento = await Evento.findById(req.params.id);

        if (!evento) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el evento especificado'
            });
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            ok: true,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
        });
    }
}




module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}