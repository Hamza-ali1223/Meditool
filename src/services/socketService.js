import {io} from 'socket.io-client'

class SocketService {
    socket = null;
    userId = null;
    listeners = {};
    isConnected = false;
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;

    // Initialize SocketConnection with Server
    init(userId, serverUrl = "https://k704q0wc-9092.inc1.devtunnels.ms/") {
        // Store userId for registration and reconnection
        this.userId = userId;
        
        // Prevent multiple Connections
        if (this.socket) {
            console.log("🔄 Socket Already Initialized");
            return this;
        }

        console.log(`🚀 Initializing socket for User ${userId} to ${serverUrl}`);
        
        // ✅ FIXED: Use both transports for better compatibility
        this.socket = io(serverUrl, {
            transports: ['websocket', 'polling'], // ✅ Add polling fallback
            autoConnect: true, // ✅ Auto connect
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000, // ✅ Increased timeout
            forceNew: true, // ✅ Force new connection
        });

        // Setting up Basic Connection Handlers
        this.setupConnectionHandlers();
        return this;
    }

    setupConnectionHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log(`✅ Socket Connected Successfully: ${this.socket.id}`);
            this.isConnected = true;
            this.reconnectAttempts = 0;
            
            // ✅ Auto-register user after connection
            if (this.userId) {
                console.log(`📝 Auto-registering user: ${this.userId}`);
                this.register();
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`❌ Socket disconnected: ${reason}`);
            this.isConnected = false;
            
            if (reason === 'io server disconnect') {
                console.log('🔴 Server initiated disconnect, no reconnection attempt');
            }
        });

        this.socket.on('connect_error', (error) => {
            this.reconnectAttempts++;
            console.error(`💥 Socket connection error (${this.reconnectAttempts}/${this.maxReconnectAttempts}):`, error.message);
            console.error('🔍 Error details:', error);
            
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('🚫 Max reconnection attempts reached, giving up');
                this.socket.disconnect();
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
            this.isConnected = true;
            
            // Re-register user after reconnection
            if (this.userId) {
                this.register();
            }
        });

        this.socket.on('reconnect_error', (error) => {
            console.error('🔄❌ Reconnection error:', error);
        });

        // Add specific event handlers for our WebRTC signaling
        this.setupSignalingHandlers();
    }

    setupSignalingHandlers() {
        // These will be set up by the call service later
        console.log('📡 Signaling handlers setup ready');
    }

    register() {
        if (!this.socket || !this.isConnected) {
            console.error('❌ Cannot register - socket not connected');
            return false;
        }
        
        if (!this.userId) {
            console.error('❌ Cannot register - no userId set');
            return false;
        }
        
        console.log(`📝 Registering user: ${this.userId}`);
        
        this.socket.emit('register', this.userId, (response) => {
            if (response) {
                console.log('✅ Registration response:', response);
            } else {
                console.log('✅ User registered successfully');
            }
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
        if (!this.socket) {
            console.error(`❌ Cannot emit ${event} - no socket instance`);
            return false;
        }
        
        if (!this.isConnected) {
            console.error(`❌ Cannot emit ${event} - socket not connected`);
            return false;
        }
        
        try {
            if (callback) {
                this.socket.emit(event, data, callback);
            } else {
                this.socket.emit(event, data);
            }
            console.log(`📤 Emitted ${event}:`, data);
            return true;
        } catch (error) {
            console.error(`❌ Error emitting ${event}:`, error);
            return false;
        }
    }

    on(event, handler) {
        if (!this.socket) {
            console.error(`❌ Cannot add listener for ${event} - no socket instance`);
            return;
        }
        
        // Store reference to remove later
        this.listeners[event] = handler;
        this.socket.on(event, handler);
        console.log(`👂 Listening for ${event}`);
    }

    off(event) {
        if (!this.socket) return;
        
        if (this.listeners[event]) {
            this.socket.off(event, this.listeners[event]);
            delete this.listeners[event];
            console.log(`🔇 Stopped listening for ${event}`);
        } else {
            // Fallback: remove all listeners for this event
            this.socket.off(event);
            console.log(`🔇 Removed all listeners for ${event}`);
        }
    }

    isSocketConnected() {
        return this.socket && this.isConnected && this.socket.connected;
    }

    disconnect() {
        if (!this.socket) return;
        
        console.log('🔌 Disconnecting socket');
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
        this.listeners = {};
    }

    // ✅ NEW: Get socket instance (for WebRTC compatibility)
    getSocket() {
        return this.socket;
    }

    // ✅ NEW: Get connection state info
    getConnectionInfo() {
        return {
            connected: this.isConnected,
            socketId: this.socket?.id,
            userId: this.userId,
            reconnectAttempts: this.reconnectAttempts,
        };
    }
}

export default new SocketService();