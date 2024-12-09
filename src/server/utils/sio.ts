//----------------------------------------------------------------------------------------------------------------------
// Socket.IO Handler Utility
//----------------------------------------------------------------------------------------------------------------------

import { Server } from 'socket.io';

// Interfaces
import { RPGKMessage } from '../../common/interfaces/common.js';

//----------------------------------------------------------------------------------------------------------------------

let sio : Server | undefined;

//----------------------------------------------------------------------------------------------------------------------

export async function setSIOInstance(sioServer : Server) : Promise<void>
{
    sio = sioServer;
}

export async function broadcast(namespace : string, message : RPGKMessage) : Promise<void>
{
    if(sio)
    {
        const ns = sio.of(namespace);
        ns.emit('message', message);
    }
}

//----------------------------------------------------------------------------------------------------------------------
