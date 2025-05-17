const {InvalidCredentialsError}= require("../../error")

class Client{
    #id;
    #name;
    #CIF;
    #address;
    #user_id;
    #archived;

    constructor({
        id=null,
        name,
        CIF,
        address,
        user_id,
        archived = false,
    }){

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new InvalidCredentialsError();
    }

    if (!CIF || typeof CIF !== "string" || CIF.trim().length === 0) {
      throw new InvalidCredentialsError();
    }

    if (!address || typeof address !== "object") {
      throw new InvalidCredentialsError();
    }
    if (
      user_id === null ||
      typeof user_id !== "number" ||
      !Number.isInteger(user_id) ||
      user_id <= 0
    ) {
      throw new InvalidCredentialsError();
    }

        this.#id = id;
        this.#name = name;
        this.#CIF = CIF;
        this.#address = address;
        this.#user_id = user_id;
        this.#archived = archived;
    }
    
    get id(){
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get name() {
        return this.#name;
    }
    set name(value){
        this.#name = value;
    }

    get CIF(){
        return this.#CIF;
    }
    set CIF(value) {
        this.#CIF = value;
    }

    get address() {
        return this.#address;
    }
    set address(value){
        this.#address = value;
    }

    get user_id() {
        return this.#user_id;
    }
    set user_id(value){
        this.#user_id = value;
    }

    get archived() {
        return this.#archived;
    }
    set archived(value) {
        this.#archived = value;
    }

    get publicData() {
        return {
            id: this.#id,
            name: this.#name,
            CIF: this.#CIF,
            address: this.#address,
            user_id: this.#user_id,
            archived: this.#archived
        };
    }
}

module.exports = { Client };