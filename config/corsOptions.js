const allowedOrigins = process.env.ORIGINS.split(',').map(o => o.trim());
console.log(allowedOrigins)

const corsOptions = {
    origin: (origin, callback) => {
        let isAllowed = allowedOrigins.includes(origin) || !origin;

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 // default is 204 which causes problems on some devices
};

export default corsOptions;