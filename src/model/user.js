import mongoose from 'mongoose';

const opts = {
    toJSON: {
        virtuals: true, versionKey: false, transform: function (doc, ret) {
            delete ret._id
            delete ret.id
        }
    }
}

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    phoneNo: {
        type: String,
        validate: {
            validator: (value) => {
                return /\d{10}/.test(value)
            },
            message: props => `${props.value} is not a valid phone number`
        },
    },
    onlineStatus: {
        type: Number,
        default: 0
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    imgUrl:{
        type:String,
        default:`https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/100`
    }


}, opts)

userSchema.virtual('uuid').get(function () { return this._id.toHexString() })

let User = mongoose.model('User', userSchema)

module.exports = User;