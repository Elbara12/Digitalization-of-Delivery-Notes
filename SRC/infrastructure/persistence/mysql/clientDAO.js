const pool = require('./db');
const logger = require("../../web/utils/logger");
const { 
    InvalidDatabaseError,
    ClientNotFoundError,
    NotAuthorizedError,
    ClientNotArchivedError,
 } = require("../../../business/error");
const { Client } = require("../../../business/client/domain/client"); 

class clientDAO { 
    constructor() {
      this.init();
    }
  
    async init() {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS clients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            CIF VARCHAR(50) NOT NULL,
            address TEXT NOT NULL,
            user_id INT,
            archived BOOLEAN NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `);
        logger.info("Table 'clients' created or already exists");
      } catch (err) {
        logger.error("Error creating table 'clients':", err);
        throw new InvalidDatabaseError();
      }
    }


    async insert(client){
        const [result] = await pool.query(
            'INSERT INTO clients (name, CIF, address, user_id, archived) VALUES (?, ?, ?, ?, ?)',
            [client.name, client.CIF, JSON.stringify(client.address), client.user_id, client.archived]
        );

        client.id= result.insertId;
        return client;
    }

    async checkCif(cif, userId) {
        const [rows] = await pool.query(
            'SELECT 1 FROM clients WHERE CIF = ? AND user_id = ?',
            [cif, userId]
        );
        return rows.length > 0;
    }

    async updateClient(client, payload) {
        const [result] = await pool.query(
            'UPDATE clients SET name = ?, CIF = ?, address = ? WHERE id = ? AND archived = 0 AND user_id = ?',
            [client.name, client.CIF, JSON.stringify(client.address), client.client_id, payload.id]
        );

        if (result.affectedRows === 0) {
            throw new ClientNotFoundError();
        }
    }

    async getClientById(clientId, route=false, userId=null) {
        let rows;
        if (route){
            [rows] = await pool.query(
            'SELECT * FROM clients WHERE id = ? AND user_id = ?',
            [clientId, userId]
        );
        if (rows.length === 0) {
            throw new ClientNotFoundError();
        }
    }else{
        [rows] = await pool.query(
            'SELECT * FROM clients WHERE id = ?',
            [clientId]
        );
        if (rows.length === 0) {
            throw new ClientNotFoundError();
        }
    }
        const raw = rows[0];

        const clientData = new Client({
            id: raw.id,
            name: raw.name,
            CIF: raw.CIF,
            address: JSON.parse(raw.address),
            user_id: raw.user_id,
            archived: raw.archived
    });

    return clientData;
    }

    async getClients(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM clients WHERE user_id = ?',
            [userId]
        );
    
        const clients = rows.map(raw => new Client({
            id: raw.id,
            name: raw.name,
            CIF: raw.CIF,
            address: JSON.parse(raw.address),
            user_id: raw.user_id,
            archived: raw.archived
        }));
    
        return clients.map(client => client.publicData);
    }

    async deleteClient(clientId, soft) {
        if (soft) {
            await pool.query(
              "UPDATE clients SET archived = 1 WHERE id = ?",
              [clientId]
            );
          } else {
            await pool.query(
              "DELETE FROM clients WHERE id = ?",
              [clientId]
            );
          }
          
    }

    async getArchived(userId) {
        const [rows] = await pool.query(
            'SELECT * FROM clients WHERE user_id = ? AND archived = 1', 
            [userId]
        );
    
        const clients = rows.map(raw => new Client({
            id: raw.id,
            name: raw.name,
            CIF: raw.CIF,
            address: JSON.parse(raw.address),
            user_id: raw.user_id,
            archived: raw.archived
        }));
    
        return clients.map(client => client.publicData);
    }

    async restoreArchived(clientId, userId) {
        const [rows] = await pool.query(
            'SELECT user_id, archived FROM clients WHERE id = ? ',
            [clientId]
        );
        if (rows.length === 0) {
            throw new ClientNotFoundError();
        }

        const client = rows[0];

        if (client.user_id !== userId) {
            throw new NotAuthorizedError();
        }

        if (client.archived === 0) {
            throw new ClientNotArchivedError();
        }
        await pool.query(
            "UPDATE clients SET archived = 0 WHERE id = ? ",
            [clientId]
        );
    }

}

module.exports = new clientDAO();