const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL);

        console.log('DB online')

    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar base de datos')
    }
}

module.exports = { dbConnection }