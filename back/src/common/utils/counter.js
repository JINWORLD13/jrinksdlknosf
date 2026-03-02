const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const CounterSchema = new Schema({ // new Schema(위에 import 해야함) 혹은 new mongoose.Schema ok
    name : {
        type: String,
        required: true,
    },
    totalPost : {
        type: Number,
        required: true,
    }
}, { versionKey : false })


exports.Counter = mongoose.model('Counter', CounterSchema); 