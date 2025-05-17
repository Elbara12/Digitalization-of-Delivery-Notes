const { InvalidCredentialsError } = require("../../error");

class DeliveryNote {
    #id;
    #userId;
    #clientId;
    #projectId;
    #signed;
    #signatureUrl;
    #pdfUrl;

    constructor({ 
        id=null,
        userId,
        clientId,
        projectId= null,
        signed = false,
        signatureUrl = null,
        pdfUrl = null,
    }) {
        if (
      typeof userId !== "number" ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new InvalidCredentialsError("Invalid userId");
    }

    if (
      typeof clientId !== "number" ||
      !Number.isInteger(clientId) ||
      clientId <= 0
    ) {
      throw new InvalidCredentialsError("Invalid clientId");
    }

    if (
      typeof projectId !== "number" ||
      !Number.isInteger(projectId) ||
      projectId <= 0
    ) {
      throw new InvalidCredentialsError("Invalid projectId");
    }
        this.#id = id;
        this.#userId = userId;
        this.#clientId = clientId;
        this.#projectId = projectId;
        this.#signed = signed;
        this.#signatureUrl = signatureUrl;
        this.#pdfUrl = pdfUrl;
    }
        

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get userId() {
        return this.#userId;
    }
    set userId(value) {
        this.#userId = value;
    }

    get projectId() {
        return this.#projectId;
    }
    set projectId(value) {
        this.#projectId = value;
    }

    get clientId() {
        return this.#clientId;
    }
    set clientId(value) {
        this.#clientId = value;
    }

    get signed() {
        return this.#signed;
    }
    set signed(value) {
        this.#signed = value;
    }

    get signatureUrl() {
        return this.#signatureUrl;
    }
    set signatureUrl(value) {
        this.#signatureUrl = value;
    }

    get pdfUrl() {
        return this.#pdfUrl;
    }
    set pdfUrl(value) {
        this.#pdfUrl = value;
    }

    get publicData() {
        return {
            id: this.#id,
            userId: this.#userId,
            clientId: this.#clientId,
            projectId: this.#projectId,
            signed: this.#signed,
            signatureUrl: this.#signatureUrl,
            pdfUrl: this.#pdfUrl
        };
    }

}

module.exports = {DeliveryNote};