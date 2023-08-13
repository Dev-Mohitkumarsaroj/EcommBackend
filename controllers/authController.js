import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';

export const registerController = async (req, res) => {
    try {

        const { name, email, password, phone, address } = req.body;
        // validation
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'E-mail is required' });
        }
        if (!password) {
            return res.send({ message: 'Password is required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone no is required' });
        }
        if (!address) {
            return res.send({ message: 'Address is required' });
        }
        // cheack user
        const exisitingUser = await userModel.findOne({ email })

        // Exisiting user accounts
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already register please login',
            })
        }

        // register user
        const hashedPassword = await hashPassword(password);

        // save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            message: "user register successfully",
            user,

        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error

        })

    }
};

// POST LOGIN
export const loginController = async (req, res) => {

    try {
        const { email, password } = req.body
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }


        // cheack user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'email is not registered'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: ' Invalid password'
            })
        }


        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })
        res.status(200).send({
            success: true,
            message: 'login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in login',
            error

        })
    }
}

// test controller
export const testController = (req, res) => {
    res.send("protected route");

}





