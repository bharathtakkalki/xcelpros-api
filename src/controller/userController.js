import { Router } from 'express';
import User from '../model/user';
import bcrypt from 'bcrypt';
import { generateAccessToken, respond, authenticateToken ,checkLoggedOut } from '../middleware/authMiddleware';
import UserAuth from '../model/userAuth';




export default () => {
    let api = Router()

    api.post('/register', (req, res, next) => {
        bcrypt.hash(req.body.password, 12).then(hashedPassword => {
            const user = new User({
                email: req.body.email,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            })
            user.save().then(result => {
                res.status(201).json({
                    status: "User Successfully Created",
                    uuid: result._id
                })
            }).catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err)
            })

        }).catch(err => {
            console.log(err)
        })

    })

    api.post('/login', (req, res, next) => {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    const error = new Error()
                    error.json = { message: 'Email id could not be Found', errorCode: 'ATH-001' }
                    error.statusCode = 404
                    throw error;
                }
                req.user = user
                user.onlineStatus = 1
                user.save()
                return bcrypt.compare(req.body.password, user.password)
            })
            .then(isEqual => {
                if (!isEqual) {
                    const error = new Error()
                    error.json = { message: 'Entered wrong password', errorCode: 'ATH-002' }
                    error.statusCode = 401
                    throw error
                }
                next()

            })
            .catch(err => {
                console.log(err)
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })

    }, generateAccessToken, respond)

    api.get('/', authenticateToken,checkLoggedOut ,(req, res, next) => {
        User.find().select('id firstName lastName email phoneNo onlineStatus')
            .then(user => {

                res.status(200).json(user);
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    })

    api.put('/:id', authenticateToken,checkLoggedOut,(req, res, next) => {
        User.findOneAndUpdate(req.params.id, req.body, { new: true, fields: 'uuid firstName lastName email phoneNo onlineStatus' })
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                if (!err.statusCode) {
                    console.log(err)
                    err.statusCode = 500
                }
                next(err)
            })
    })

    api.get('/logout', authenticateToken,checkLoggedOut,(req, res) => {
        UserAuth.findOneAndUpdate({user:req.user.uuid},{logoutAt:new Date()},{new:true})
        .then(userAuth => {
            res.status(200).json('successfully logged out');
        })
        .catch(err => {
            if (!err.statusCode) {
                console.log(err)
                err.statusCode = 500
            }
            next(err)
        })

    });

    api.delete('/:id',authenticateToken,checkLoggedOut, (req, res) => {
        
        User.deleteOne({email:req.user.email})
        .then(user => {
            console.log(user)
            res.status(200).json('User successfully removed');
        })
        .catch(err => {
            if (!err.statusCode) {
                console.log(err)
                err.statusCode = 500
            }
            next(err)
        })
    });



    return api;
}