import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import {
    addSkillToLearn,
    addSkillToTeach,
    deleteSkillCanTeach,
    deleteSkillToLearn,
    getAllSkills,
    updateSkill,
    updateSkillsToTeach,
    updateSkillsToLearn
} from '../controllers/skill.controller.js'

const router = express()

router.get('/', (req, res) => {
    res.send("From Skill Page")
})

router.get('/all-skills', verifyToken, getAllSkills)
router.post('/add-skill-to-learn', verifyToken, addSkillToLearn)
router.post('/add-skill-can-teach', verifyToken, addSkillToTeach)
router.put('/update/:id', verifyToken, updateSkill)
router.put('/update-skills-to-teach', verifyToken, updateSkillsToTeach)
router.put('/update-skills-to-learn', verifyToken, updateSkillsToLearn)
router.delete('/delete-skill-can-teach/:id', verifyToken, deleteSkillCanTeach)
router.delete('/delete-skill-to-learn/:id', verifyToken, deleteSkillToLearn)

export default router