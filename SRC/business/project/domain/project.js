const {InvalidCredentialsError}= require("../../error")

class Project{
    #id;
    #name;
    #email;
    #address;
    #userId;
    #clientId;
    #archived;

    constructor({ 
        id=null,
        name,
        email,
        address,
        userId,
        clientId,
        archived = false, 
    }) {
        if (!name || typeof name !== "string" || name.trim().length < 2) {
      throw new InvalidCredentialsError("A valid name is required for the project");
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      throw new InvalidCredentialsError("A valid email is required for the project");
    }

    if (!address || typeof address !== "object") {
      throw new InvalidCredentialsError("A valid address is required for the project");
    }

    if (
      typeof userId !== "number" ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new InvalidCredentialsError("Invalid userId for project");
    }

    if (
      typeof clientId !== "number" ||
      !Number.isInteger(clientId) ||
      clientId <= 0
    ) {
      throw new InvalidCredentialsError("Invalid clientId for project");
    }

        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#address = address;
        this.#userId = userId;
        this.#clientId = clientId;
        this.#archived = archived;
    }

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get name() {
        return this.#name;
    }
    set name(value) {
        this.#name = value;
    }

    get email() {
        return this.#email;
    }
    set email(value) {
        this.#email = value;
    }

    get address() {
        return this.#address;
    }
    set address(value) {
        this.#address = value;
    }

    get userId() {
        return this.#userId;
    }
    set userId(value) {
        this.#userId = value;
    }

    get clientId() {
        return this.#clientId;
    }
    set clientId(value) {
        this.#clientId = value;
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
            email: this.#email,
            address: this.#address,
            userId: this.#userId,
            clientId: this.#clientId,
            archived: this.#archived
        };
    }
}

module.exports = {Project,};