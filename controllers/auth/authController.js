import { query } from '../../config/db.js';
import bcrypt from 'bcrypt';

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const result = await query('SELECT "id", "password" FROM "User" WHERE "email"=$1 LIMIT 1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.userId = user.id;
    res.json({ message: 'Login successful' });
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            logEvents('Logout Unsuccessful','errLog.log');
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
};

export default {
    login,
    logout
}
