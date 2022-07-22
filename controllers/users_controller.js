// DEPENDENCIES
const users = require('express').Router()
const db = require('../models')
const { Users, Tasks } = db 
const { Op } = require('sequelize')
const users = require('../models/users')

// FIND ALL USERS
users.get('/', async (req, res) => {
    try {
        const foundUsers = await Users.findAll({
            order: [ [ 'available_start_time', 'ASC' ] ],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            }
        })
        res.status(200).json(foundUsers)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC USERS
users.get('/:name', async (req, res) => {
    try {
        const foundUsers = await Users.findOne({
            where: { name: req.params.name },
            include: [
                { 
                    model: Tasks, 
                    as: "tasks", 
                    attributes: { exclude: ["users_id", "tasks_id"] },
                    include: { 
                        model: Tasks, 
                        as: "tasks", 
                        where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } } 
                    }
                },
                { 
                    model: SetTime, 
                    as: "set_times",
                    attributes: { exclude: ["band_id", "event_id"] },
                    include: { 
                        model: Event, 
                        as: "event", 
                        where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } } 
                    }
                }
            ],
            order: [
                [{ model: MeetGreet, as: "meet_greets" }, { model: Event, as: "event" }, 'date', 'DESC'],
                [{ model: SetTime, as: "set_times" }, { model: Event, as: "event" }, 'date', 'DESC']
            ]
        })
        res.status(200).json(foundUsers)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE A USER
users.post('/', async (req, res) => {
    try {
        const newUsers = await Users.create(req.body)
        res.status(200).json({
            message: 'Welcome New User',
            data: newUsers
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// UPDATE A USER
users.put('/:id', async (req, res) => {
    try {
        const updatedUsers = await users.update(req.body, {
            where: {
                users_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedUsers} user(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// DELETE A USER
users.delete('/:id', async (req, res) => {
    try {
        const deletedUsers = await Users.destroy({
            where: {
                users_id: req.params.id
            }
        })
        res.status(200).json({
            message: `BYE BYE ${deletedUsers} User(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// EXPORT
module.exports = Users