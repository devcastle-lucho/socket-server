import * as socket from '../sockets/socket';

import { SERVER_PORT } from '../global/environment';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

export default class Server {

    private static _intance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;


    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSockets();
    }

    public static get instance() {
        return this._intance || ( this._intance = new this() );
    }


    private escucharSockets() {

        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {
            //Conectar cliente
            socket.conectarCliente(cliente, this.io);
            // Configurar usuario.
            socket.configurarUsuario( cliente, this.io);
            console.log('Cliente conectado');

            // Obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io);

            // Mensajes
            socket.mensaje( cliente, this.io );

            // Desconectar
            socket.desconectar( cliente ,this.io);        
            
        });

    }


    start( callback: Function ) {

        this.httpServer.listen( this.port, callback );

    }

}