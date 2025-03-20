const Server = require("./server");

let serverInstance = new Server();
let server = serverInstance.httpServer; // Usar httpServer ao invés do app
let port = 4000;

server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
