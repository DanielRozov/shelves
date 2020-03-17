import mongoose from 'mongoose';

export function dbConnection() {
  mongoose.connect('mongodb://localhost/shelves', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
}