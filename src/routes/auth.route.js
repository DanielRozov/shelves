import { postUser } from '../controllers/auth.controller'
import express from 'express'

const routes = (app) => {

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .route('/api/auth')
    .post(postUser)
}

export default routes;