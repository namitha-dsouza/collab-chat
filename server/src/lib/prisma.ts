import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
const { PrismaClient } = require('@prisma/client')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export default prisma