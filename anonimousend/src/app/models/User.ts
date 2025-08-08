import mongoose , {Schema,Document} from "mongoose"; // using document for typescript

export interface Message extends Document {
   content : string;
  createdAt : Date
}
const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    } ,
    createdAt : {
      type : Date,
      required : true,
      default : new Date()
    }
})
// i have created interface with the name of Message using the Message data type , created a message schema,and now going to create an user schema (above)
export interface User extends Document {
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean,
    isAcceptingMessage : boolean;
    messages : Message[]
  }
  const UserSchema : Schema<User> = new Schema({
      username : {
          type : String,
          required : [true,"Username is required"],
          trim : true,
          unique : true,
      } ,
      email : {
        type : String,
        required : [true,"email is required"],
        unique : true,
        match : [/.+\@.+\..+/,'please use a valid email address']
    } ,
     password : {
        type : String,
        required : [true,"password is required"]
    } ,
    verifyCode : {
        type : String,
        required : [true,"verifycode is required"],
    } ,
    verifyCodeExpiry: {
        type : Date,
        required : true
    } ,
    isVerified : {
        type : Boolean,
        default : false,
    },
    isAcceptingMessage:{
        type : Boolean,    // make sure to store B that is Boolean
        required : false
    },
    messages :{
        type : [MessageSchema],
    }
  })

  const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

  export default UserModel;