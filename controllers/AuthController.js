const _ = require('lodash')
const Config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('../node_modules/up_core/models/User')

class AuthController {
    static async createUser(req,res,next) 
    {
        try
        {
            const mappedUser = 
            _.chain(req.body)
                .pick(['nickname', 'name', 'surname', 'email', 'password'])
                .value()
            
            const user = await new User(mappedUser)
        }
        catch (error)
        {
            next(error)
            res.status(400).send(error)
        }
    }
}