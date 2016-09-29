var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.save = function(req, res) {
    var userModel = new User(req.body);
    userModel.save(function(err, user) {
        if (err) {
            res.json({
                success: false,
                data: err
            })
        } else {
            res.json({
                success: true,
                data: user
            })
        }
    });
};

exports.update = function(req, res) {
    User.findOne({_id: req.params.id}, function(err, user) {
        if (err) {
            res.status(500).json({
                success: false,
                data: err
            })
        } else {
            if (!user) {
                res.status(404).json({
                    success: false,
                    data: 'User not found'
                })
            } else {
                user.name = req.body.name;
                user.email = req.body.email;
                user.password = req.body.password;

                user.save(function(err, user) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            data: err
                        })
                    } else {
                        res.json({
                            success: true,
                            data: 'User updated successfully'
                        })
                    }
                });
            }
        }
    });
};

exports.delete = function(req, res) {
    User.findOneAndRemove({_id: req.params.id}, function(err) {
        if (err) {
            res.status(500).json({
                success: false,
                data: err
            })
        } else {
            res.json({
                success: true,
                data: 'User deleted'
            })
        }
    });
};

exports.list = function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            res.status(500).json({
                success: false,
                userData: err
            })
        } else {
            res.json({
                success: true,
                data: users
            })
        }
    });
};

exports.get = function(req, res) {
    User.findOne({_id: req.params.id}, function(err, user) {
        if (err) {
            res.json({
                success: false,
                userData: err
            })
        } else {
            if (user) {
                res.json({
                    success: true,
                    data: user
                })
            } else {
                res.status(404).json({
                    success: false,
                    userData: 'User not found'
                })
            }
        }
    })
};