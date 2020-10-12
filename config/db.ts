import mongoose from 'mongoose'
import config from 'config'

const mongoURI: string = config.get('mongoURI')

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('MongoDB Connected...')
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
