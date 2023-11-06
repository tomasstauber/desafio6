class DTOFactory {
    createUserDTO(user) {
        console.log("Datos de usuario antes de crear DTO en factory:", user);
        return new UserDTO(user);
    }
}

export default DTOFactory;