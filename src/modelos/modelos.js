import mongoose from "mongoose";
const articuloSchema= new mongoose.Schema({
    nombre: {type:String,required:true},
    precio: {type:Number,required:true},
    descripcion: {type:String}
});

const Articulo = mongoose.model('Articulo',articuloSchema);
export default Articulo;