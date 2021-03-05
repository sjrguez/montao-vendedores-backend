import { Router } from 'express';

import UserController from './controller'

const ROUTER: Router = Router();


ROUTER.post('/', UserController.createUser)

ROUTER.get('/:id', UserController.getUserById)

ROUTER.put('/:id', UserController.updateUser)


module.exports = ROUTER
