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

    const rolesQuery = await query(`SELECT r.name
         FROM "Role" r
         JOIN "_UserRoles" ur ON r.id = ur."A"
         WHERE ur."B" = $1`,
        [Number(user.id)]
    );
    const roles = rolesQuery.rows.map(row => row.name);
    if (roles.length === 0) return res.status(404).json({ message: 'No roles found for logged in user' });
    req.session.regenerate(err => {
        if (err) return res.status(500).json({ message: 'Session error' });
        req.session.userId = user.id;
        req.session.roles = roles;
        res.json({ message: 'Login successful' });
    });
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
