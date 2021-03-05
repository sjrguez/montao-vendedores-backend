
import { Request } from 'express'

interface Usuario  {
    id_usuario: string
}
export type RequestType = Request & Usuario


