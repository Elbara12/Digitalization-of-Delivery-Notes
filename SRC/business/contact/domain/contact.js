const {
    InvalidEmailError,
    InvalidNameError,
 } = require("../../error")

class Contact {
    #id;
    #email;
    #password_hash;
    #attempts;
    #email_code;
    #emailstatus;
    #status;
    #role;
    #url;
    #name;
    #NIF;
    #surname;
    #CIF;
    #address;

    #EMAIL_VALIDATION_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
    constructor ({
      id=null,
      email,
      name=null,
      surname=null,
      NIF=null,
      CIF=null,
      address=null,
      url=null,
      password_hash=null,
      email_code,
      attempts=5,
      emailstatus=0,
      role="user",
      status="tobevalidated",
    }) {
      this.id = id;
      this.email = email;
      this.password_hash = password_hash;
      this.attempts = attempts;
      this.email_code = email_code;
      this.emailstatus = emailstatus;
      this.role = role;
      this.status = status;
      this.name = name;
      this.NIF = NIF;
      this.surname = surname;
      this.CIF = CIF;
      this.address = address;
      this.url = url;
    }
  
    get id() {
      return this.#id;
    }
    set id(value) {
      this.#id = value;
    }
  
    get email() {
      return this.#email;
    }
    set email(value) {
      if (!this.#EMAIL_VALIDATION_REGEX.test(value)) {
        throw new InvalidEmailError();
      }
      this.#email = value;
    }

    get password_hash() {
        return this.#password_hash;
    }
    set password_hash(value) {
        this.#password_hash = value;
    }

    get attempts(){
        return this.#attempts;
    }
    set attempts(value){
        this.#attempts=value;
    }

    get email_code(){
        return this.#email_code;
    }
    set email_code(value){
        this.#email_code= value;
    }

    get emailstatus(){
        return this.#emailstatus;
    }
    set emailstatus(value){
        this.#emailstatus=value;
    }

    get role(){
        return this.#role;
    }
    set role(value){
        this.#role= value;
    }

    get url(){
        return this.#url;
    }
    set url(value){
        this.#url=value;
    }
    get status(){
        return this.#status;
    }
    set status(value){
        this.#status=value;
    }

    get name() {
      return this.#name;
    }
    set name(value) {
      if (value === null || typeof value !== "string"){
        return this.#name=value;
      }
      if (!value || value.length < 3)
        throw new InvalidNameError();
      this.#name = value;
    }
    
  
    get NIF(){
      return this.#NIF;
    }
    set NIF(value) {
        this.#NIF=value;
    }
  
    get surname() {
        return this.#surname;
    }
    set surname(value){
        this.#surname=value;
    }

    get CIF(){
      return this.#CIF;
    }
    set CIF(value) {
        this.#CIF=value;
    }
  
    get address() {
        return this.#address;
    }
    set address(value){
        this.#address=value;
    }

    get publicData() {
      return {
        id: this.id,
        email: this.email,
        attempts: this.attempts,
        emailstatus: this.emailstatus,
        role: this.role,
        status: this.status,
      };
    }

    get publicDataUser() {
      return {
        id: this.id,
        email: this.email,
        name: this.name,
        surname: this.surname,
        NIF: this.NIF,
        attempts: this.attempts,
        emailstatus: this.emailstatus,
        role: this.role,
        status: this.status,
        url: this.url,
      };
    }

    get publicDataCompany() {
      return {
        id: this.id,
        email: this.email,
        name: this.name,
        CIF: this.CIF,
        address: this.address,
        attempts: this.attempts,
        emailstatus: this.emailstatus,
        role: this.role,
        status: this.status,
        url: this.url,
      };
    }
  }
  
  module.exports = { Contact };
  