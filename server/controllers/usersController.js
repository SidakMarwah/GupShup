import User from "../model/userModel.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {

    try {

        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username: username });
        if (usernameCheck)
            return res.status(409).json({ message: 'Username already exists', status: false });

        const emailCheck = await User.findOne({ email: email });
        if (emailCheck)
            return res.status(409).json({ message: 'Email is already in use.', status: false });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        delete user.password; //delete the password property before sending it to client side

        //res.send('User registered successfully');
        res.status(201).json({ data: user, message: 'User created successfully!', status: true })

    } catch (error) {

        console.log("Error at registration : ", error);
        res.status(500).json({ message: 'Internal Server Error' });
        next(error);

    }

};


export const login = async (req, res, next) => {

    try {

        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!user || !isPasswordValid)
            return res.json({ message: 'Incorrect username or password', status: false });

        delete user.password;

        res.json({ data: user, status: true })

    } catch (error) {

        console.log("Error at login : ", error);
        res.status(500).json({ message: 'Internal Server Error' });
        next(error);

    }

};

export const setAvatar = async (req, res, next) => {

    try {

        const userId = req.params.id;
        const avatarImage = req.body.image;

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        }, {
            new: true
        });

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })

    } catch (error) {
        next(error);
    }

}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select(["email", "username", "avatarImage", "_id"]);
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
}