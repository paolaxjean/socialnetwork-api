const mongoose = require('mongoose');
const {Thoughts, Users} = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thoughts.find()
        .then((Thoughts) => res.json((Thoughts)))
        .catch((err) => res.status(500).json(err));
    },
    getSingleThoughts(req, res) {
        Thoughts.findOne({ _id: req.params.userId})
        .select('-__v')
        .then((Thoughts) =>
        !Thoughts 
        ? res.status(404).json({ message: 'no thought with that ID!'})
        : res.json(Thoughts)
        )
        .catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
      Thought.create(req.body)
        .then((thought) => {
          return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id } },
            { new: true }
          );
        })
        .then((user) =>
          !user
            ? res.status(404).json({
                message: 'Thought created, but found no user with that ID',
              })
            : res.json({ message: 'Created the thought' })
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
    removeThoughts(req, res) {
        Thoughts.findOneAndDelete({_id: req.params.thoughtsId})
        .then((Thoughts) =>
        !Thoughts
        ? res.status(404).json({ message: "no thought with that ID!"})
        : User.findOneAndUpdate(
            { username: Thoughts.username},
            { $pull: {thoughts: req.params.thoughtsId}},
            {new: true}
        )
        )
        .then((User) =>
        !User
        ? res.status(404).json({
            message: "thought deleted but no user found"
        })
        : res.json({message: 'Thought succesfully deleted'})
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    updateThoughts(req, res) {
        Thoughts.findOneAndUpdate(
            {_id: req.params.thoughtsId},
            { $set: req.body},
            { runValidators: true, new: true}
        )
        .then((Thoughts) =>
        !Thoughts
        ? res.status(404).json({ message: "no thought with that ID!"})
        : res.json(Thoughts)
        )
        .catch((err) => res.status(500).json(err));
    },
    createReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId},
            { $push: { reactions: req.body}},
            { runValidators: true, new: true}
        )
        .then((Thoughts) => {
            !Thoughts 
            ? res.status(404).json({ message: "no thought with that ID!"})
            : res.json(Thoughts);
        })
        .catch((err) => res.status(500).json(err));
    },
    removeReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId},
            { $pull: {reactions: { reactionId: req.params.reactionId}}},
            { runValidators: true, new: true}
        )
        .then((Thoughts) => {
            !Thoughts
            ? res.status(404).json({ message: "no thought with that ID!"})
            : res.json(Thoughts);
        })
        .catch((err) => res.status(500).json(err));
    },

};