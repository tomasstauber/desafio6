class UserDTO {
    constructor(user) {
        console.log("Datos del usuario antes de crear DTO:", user);
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.email = user.email;
        this.role = user.role;
        this.age = user.age;
    }
}

export default UserDTO;