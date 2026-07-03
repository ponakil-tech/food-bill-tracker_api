class User {

    constructor(id, name, phone, password, status, created_at, updated_at) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.password = password;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

}

module.exports = User;