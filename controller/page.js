exports.getloginpage = (req, res, next) => {
    res.sendFile('/signup.html', {root: 'views'}, (err) => {
        if (err) {
            // Handle the error, e.g., log it or send an error response
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    });
}