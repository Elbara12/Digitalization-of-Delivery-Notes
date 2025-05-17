const { InvalidCredentialsError } = require("../../error");

class DeliveryNoteEntries {
    #id;
    #deliveryNoteId;
    #type;
    #person;
    #hours;
    #material;
    #quantity;
    #description;
    #workdate;

    constructor({
        id=null,
        deliveryNoteId,
        type,
        person,
        hours=null,
        material=null,
        quantity=null,
        description,
        workdate
    }) {

        if (
      typeof deliveryNoteId !== "number" ||
      !Number.isInteger(deliveryNoteId) ||
      deliveryNoteId <= 0
    ) {
      throw new InvalidCredentialsError("Invalid deliveryNoteId");
    }

    if (!["hours", "material"].includes(type)) {
      throw new InvalidCredentialsError("Type must be 'hours' or 'material'");
    }

    if (!description || typeof description !== "string") {
      throw new InvalidCredentialsError("Description is required and must be a string");
    }

    if (!workdate || isNaN(Date.parse(workdate))) {
      throw new InvalidCredentialsError("Workdate must be a valid date");
    }

        this.#id = id;
        this.#deliveryNoteId = deliveryNoteId;
        this.#type = type;
        this.#person = person;
        this.#hours = hours;
        this.#material = material;
        this.#quantity = quantity;
        this.#description = description;
        this.#workdate = workdate;
    }

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get deliveryNoteId() {
        return this.#deliveryNoteId;
    }
    set deliveryNoteId(value) {
        this.#deliveryNoteId = value;
    }

    get type() {
        return this.#type;
    }
    set type(value) {
        this.#type = value;
    }

    get person() {
        return this.#person;
    }
    set person(value) {
        this.#person = value;
    }

    get hours() {
        return this.#hours;
    }
    set hours(value) {
        this.#hours = value;
    }

    get material() {
        return this.#material;
    }
    set material(value) {
        this.#material = value;
    }

    get quantity() {
        return this.#quantity;
    }
    set quantity(value) {
        this.#quantity = value;
    }

    get description() {
        return this.#description;
    }
    set description(value) {
        this.#description = value;
    }

    get workdate() {
        return this.#workdate;
    }
    set workdate(value) {
        this.#workdate = value;
    }

    get publicData() {
        return {
            id: this.#id,
            deliveryNoteId: this.#deliveryNoteId,
            type: this.#type,
            person: this.#person,
            hours: this.#hours,
            material: this.#material,
            quantity: this.#quantity,
            description: this.#description,
            workdate: this.#workdate
        };
    }
}

module.exports = {DeliveryNoteEntries};