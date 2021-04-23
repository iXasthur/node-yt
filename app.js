const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const User = require('./models/User')
const Video = require('./models/Video')
const bcrypt = require('bcryptjs')

const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const {GraphQLList} = require("graphql");
const {GraphQLSchema} = require("graphql");
const {graphqlHTTP} = require("express-graphql");
const {GraphQLString} = require("graphql");
const {GraphQLObjectType} = require("graphql");


const PORT = config.get('port') || 5000

app.use(cors())
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/videos', require('./routes/videos.routes'))
app.use('/api/upload', require('./routes/upload.routes'))

const AuthResultType = new GraphQLObjectType({
    name: "AuthResult",
    fields: () => ({
        jwt: {type: GraphQLString},
        error: {type: GraphQLString},
    })
})

const VideoType = new GraphQLObjectType({
    name: "Video",
    fields: () => ({
        _id: {type: GraphQLString},
        title: {type: GraphQLString},
        fileName: {type: GraphQLString},
    })
})


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        restore_auth: {
            type: AuthResultType,
            args: { jwt: { type: GraphQLString } },
            async resolve(parent, args) {
                let jwt = args.jwt
                if (jwt && verifyJwt(jwt)) {
                    return { jwt, error: null }
                } else {
                    return { jwt: null, error: 'Unable to verify provided jwt' }
                }
            }
        },
        sign_in: {
            type: AuthResultType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const email = args.email
                const password = args.password

                const user = await User.findOne({email})
                if (!user) {
                    return { jwt: null, error: 'User does not exist' }
                }

                const isMatch = await bcrypt.compare(password, user.hashedPassword)
                if (!isMatch) {
                    return { jwt: null, error: 'Invalid password' }
                }

                const jwt = createToken(user)

                return { jwt, error: null }
            }
        },
        videos: {
            type: new GraphQLList(VideoType),
            args: {
                jwt: { type: GraphQLString },
            },
            async resolve(parent, args) {
                let jwt = args.jwt
                if (verifyJwt(jwt)) {
                    let videos = await Video.find({})
                    return videos
                } else {
                    return null
                }
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        sign_up: {
            type: AuthResultType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const email = args.email
                const password = args.password

                if (await User.findOne({email})) {
                    return { jwt: null, error: 'User with that email already exists' }
                }

                const hashedPassword = await bcrypt.hash(password, 12)
                const user = new User({
                    email,
                    hashedPassword
                })

                await user.save()

                const jwt = createToken(user)

                return { jwt, error: null }
            }
        }
    }
})

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation })

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: false
}))

async function start() {
    try {
        let mongoUri = config.get('mongoUri')
        console.log(`Connecting to MongoDB with uri ${mongoUri}`)

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        app.listen(PORT, () => {
            console.log(`App was started on port ${PORT}`)
        })

    } catch (e) {
        console.log(`Server error: ${e.message}`)
        process.exit(1)
    }
}

function createToken(user) {
    return  jwt.sign(
        {userId: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
    )
}

function verifyJwt(token) {
    try {
        if (!token) {
            return null
        }
        return jwt.verify(token, config.get('jwtSecret'))
    } catch {
        return null
    }
}

start()