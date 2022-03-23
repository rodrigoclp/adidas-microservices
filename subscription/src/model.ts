import { Schema, model, Types } from 'mongoose';
export interface Subscription {
  email: string
  newsletterId: string
  dateOfBirth: Date
  consented: boolean
  firstName?: string
  gender?: string
}
export interface Filter {
  email: string
  newsletterId: string
}
export interface SubscriptionDoc extends Subscription {
  _id: Types.ObjectId
}

const schema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  newsletterId: {
    type: String,
    trim: true,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  consented: {
    type: Boolean,
    required: true
  },
  firstName: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    lowercase: true,
    trim: true
  }
});

export default model('Subscription', schema);
