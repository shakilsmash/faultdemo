import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Fault = new Schema({
    startDateTime: {
        type: String
    },
    endDateTime: {
        type: String
    },
    duration: {
        type: String
    },
    acknowledged: {
        type: String,
        default: 'false'
    },
    domain: {
        type: String
    },
    subDomain: {
        type: String
    },
    cause: {
        type: String
    },
    action: {
        type: String
    },
    keyword: {
        type: String
    },
    completed: {
        type: String,
        default: 'false'
    }
});

export default mongoose.model('Fault', Fault);