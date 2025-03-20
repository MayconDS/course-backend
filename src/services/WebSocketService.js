class WebSocketService {
  constructor() {
    this.io = null;
  }

  // Inicializa o WebSocket com o servidor
  initialize(io) {
    if (!io) {
      throw new Error(
        "Socket.IO instance is required to initialize WebSocketService."
      );
    }
    this.io = io;
    this.setupListeners();
  }

  // Configura os listeners para o WebSocket
  setupListeners() {
    this.io.on("connection", (socket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      // Registrar o usuário em uma sala específica
      socket.on("register_user", (userId) => {
        socket.join(userId); // Cliente entra na sala com o ID do usuário
        console.log(`Cliente ${socket.id} associado ao usuário: ${userId}`);
      });

      // Listener para desconexão
      socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });
  }

  // Emite um evento para um usuário específico
  emitToUser(userId, event, data) {
    if (this.io) {
      this.io.to(userId).emit(event, data);
    } else {
      console.error("WebSocketService não inicializado.");
    }
  }

  // Emite um evento globalmente
  emit(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    } else {
      console.error("WebSocketService não inicializado.");
    }
  }
}

module.exports = new WebSocketService();
