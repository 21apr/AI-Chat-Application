import {Schema, model} from 'mongoose';

export const UserSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    password:String,
    chats: [
        {
          type: Schema.Types.ObjectId,
          ref: "Chat",
        },
      ],
})

export const UserModel = model("User", UserSchema);