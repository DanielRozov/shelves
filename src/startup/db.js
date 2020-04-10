import mongoose from 'mongoose';

export function dbConnection() {
  mongoose.connect('mongodb://localhost/shelves', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
    .then(() => {
      console.log('Connected to MongoDB...')
      return true;
    })
    .catch(err => {
      console.error('Could not connect to MongoDB...', err)
      throw err;
    });
}