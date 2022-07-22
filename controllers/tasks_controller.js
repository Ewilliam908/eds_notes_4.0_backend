// DEPENDENCIES
const tasks = require('express').Router()
const db = require('../models')
const { Users, Tasks } = db 
const { Op } = require('sequelize')
const tasks = require('../models/tasks')

// FIND ALL TASKS
tasks.get('/', async (req, res) => {
    try {
        const foundTasks = await Tasks.findAll({
            order: [ [ 'available_start_time', 'ASC' ] ],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            }
        })
        res.status(200).json(foundTasks)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC TASK
tasks.get('/:name', async (req, res) => {
    try {
        const foundTasks = await Tasks.findOne({
            where: { name: req.params.name },
            include: [
                { 
                    model: Tasks, 
                    as: "description", 
                    attributes: { exclude: ["users_id", "tasks_id"] },
                    include: { 
                        model: Tasks, 
                        as: "description", 
                        where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } } 
                    }
                },
                { 
                    model: Tasks, 
                    as: "date_assigned",
                    attributes: { exclude: ["band_id", "event_id"] },
                    include: { 
                        model: Users, 
                        as: "userName", 
                        where: { name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` } } 
                    }
                }
            ],
            order: [
                [{ model: Tasks, as: "tasks" }, { model: Users, as: "user" }, 'userName', 'DESC'],
                [{ model: Tasks, as: "tasks" }, { model: Tasks, as: "tasks" }, 'dateAssigned', 'DESC']
            ]
        })
        res.status(200).json(foundTasks)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE A USER
tasks.post('/', async (req, res) => {
    try {
        const newTasks = await Tasks.create(req.body)
        res.status(200).json({
            message: 'Created a New Task',
            data: newTasks
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// UPDATE A USER
tasks.put('/:id', async (req, res) => {
    try {
        const updatedTasks = await tasks.update(req.body, {
            where: {
                tasks_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedTasks} your task(s)!`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// DELETE A USER
tasks.delete('/:id', async (req, res) => {
    try {
        const deletedTasks = await Tasks.destroy({
            where: {
                tasks_id: req.params.id
            }
        })
        res.status(200).json({
            message: `BYE BYE ${deletedTasks} TASK(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// EXPORT
module.exports = Tasks