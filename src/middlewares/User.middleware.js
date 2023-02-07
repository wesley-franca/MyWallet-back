function hasUser(req, res, next) {
    const userId = req.headers.user;
    if (!userId) {
        return res.status(404).send("user is missing");
    } else {
        next();
    }
};

export default hasUser;