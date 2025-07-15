import {io} from 'socket.io-client'

class SocketService 
{
    socket=null;
    userId=null;
    listeners={};
    isConnected=false;
    reconnectAttempts=0;
    maxReconnectAttempts=5;


//Inilizing our SocketConnection with Server

init (userId,serverUrl="https://k704q0wc-9092.inc1.devtunnels.ms/")
{
    //Store userId for registration and reconnection
    this.userId=userId
    //Prevent multiple Connections
    if(this.socket)
    {
        console.log("Socket Already Initialized");
        return this;
    }

    console.log(`Initializing socket for the User ${userId} to ${serverUrl}`);
    
    //Creating Socket instace with options
    this.socket=io(serverUrl,
        {
            transports:['websocket'], //Force WebSocket Protocol for better Performance
            reconnection:true,
            reconnectionAttempts:this.maxReconnectAttempts,
            reconnectionDelay:1000,
            timeout:10000,
            
        }
    );

    //Setting up Basic Connection Handlers;
    this.setupConnectionHandlers();
     
    return this;
}

    setupConnectionHandlers()
    {
        if(!this.socket)
            return;

        this.socket.on('connect',()=>
        {
            console.log(`Socket Connected Successfully: ${this.socket.id}`);
            this.isConnected=true;
            this.reconnectAttempts=0;
            
            // ✅ REMOVED auto-registration - we'll do it manually
            console.log('Socket connected, waiting for manual registration...');
        })


        this.socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      this.isConnected = false;
      
      // If server disconnected us, don't attempt to reconnect
      if (reason === 'io server disconnect') {
        console.log('Server initiated disconnect, no reconnection attempt');
      }
    });

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      console.error(`Socket connection error (${this.reconnectAttempts}/${this.maxReconnectAttempts}):`, error.message);
      
      // If we've tried too many times, stop trying
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached, giving up');
        this.socket.disconnect();
      }
    });

    // Add specific event handlers for our WebRTC signaling
    this.setupSignalingHandlers();
    }

     setupSignalingHandlers() {
    // These will be set up by the call service later
    // We're just defining the method now for completeness
  }

    register() {
    if (!this.socket || !this.userId) {
      console.error('Cannot register - socket not connected or userId not set');
      return false;
    }
    
    console.log(`Registering user: ${this.userId}`);
    
    this.socket.emit('register', this.userId, (response) => {
      console.log('Registration response:', response);
    });
    
    return true;
  }

 /**
   * Emit event to server
   * @param {string} event - Event name to emit
   * @param {any} data - Data to send with event
   * @param {Function} callback - Optional callback for ack
   * @returns {boolean} Success status
   */
  emit(event, data, callback) {
    if (!this.socket || !this.isConnected) {
      console.error(`Cannot emit ${event} - socket not connected`);
      return false;
    }
    
    try {
      if (callback) {
        this.socket.emit(event, data, callback);
      } else {
        this.socket.emit(event, data);
      }
      console.log(`Emitted ${event}:`, data);
      return true;
    } catch (error) {
      console.error(`Error emitting ${event}:`, error);
      return false;
    }
  }

 
  on(event, handler) {
    if (!this.socket) return;
    
    // Store reference to remove later
    this.listeners[event] = handler;
    this.socket.on(event, handler);
    console.log(`Listening for ${event}`);
  }


   off(event) {
    if (!this.socket) return;
    
    if (this.listeners[event]) {
      this.socket.off(event, this.listeners[event]);
      delete this.listeners[event];
      console.log(`Stopped listening for ${event}`);
    }
  }

   isSocketConnected() {
    return this.isConnected;
  }

   disconnect() {
    if (!this.socket) return;
    
    console.log('Disconnecting socket');
    this.socket.disconnect();
    this.socket = null;
    this.isConnected = false;
    this.listeners = {};
  }
}
export default new SocketService();