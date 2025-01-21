import bcrypt from 'bcryptjs';

export default {
    async encriptarContrasena(password){
        try {
            const salt = await bcrypt.genSalt(10);
            const passEncriptado = bcrypt.hash(password, salt);
            return passEncriptado;
        } catch (error) {
            console.error("Error al encriptar la contraseña",error)
            throw new Error("No se pudo encriptar la contraseña")
        }

    },
    async verificarContrasena(pass, passEncriptada) {
        try {
          const esCorrecta = await bcrypt.compare(pass, passEncriptada);
          return esCorrecta;
        } catch (error) {
          console.error("Error al verificar la contraseña", error);
          throw new Error('No se pudo verificar la contraseña');
        }
    }
}